import { ApiResponse } from "../dtos/ApiResponseDTO.js";
import { crearToken } from "../helpers/tokens.js";
import Usuario from "../models/db/Usuarios.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import { mapearErrores } from "../helpers/errores.js";

/**
 * Controlador para autenticar un usuario mediante email y contraseña.
 * - Valida los campos del request.
 * - Verifica que el usuario exista en la base de datos.
 * - Compara la contraseña con la almacenada.
 * - Si es válido, devuelve un token de autenticación como cookie.
 *
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 * @returns {Response} JSON con mensaje y datos del usuario o error.
 */
const login = async (req, res) => {
  try {
    // Validar que el email no esté vacío y tenga formato válido
    await check("email")
      .notEmpty()
      .withMessage("El email es obligatorio")
      .isEmail()
      .withMessage("Debe ser mail válido")
      .run(req);

    // Validar que la contraseña no esté vacía
    await check("password")
      .notEmpty()
      .withMessage("La contraseña es obligatoria")
      // .isLength({ min: 8, max: 24 })
      // .withMessage("La contraseña debe tener entre 8 y 24 caracteres")
      .run(req);

    // Obtener y procesar los errores de validación
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
      const erroresMapedos = mapearErrores(errores);
      return res
        .status(422)
        .json(
          ApiResponse.getResponse(
            422,
            "Campos inválidos",
            erroresMapedos
          )
        );
    }

    // Obtener datos del cuerpo de la solicitud
    const email = req.body.email;
    const password = req.body.password;

    // Verificar que ambos campos existan
    if (!email || !password) {
      return res
        .status(400)
        .json(
          ApiResponse.getResponse(
            400,
            "Usuario y contraseña son requeridas",
            null
          )
        );
    }

    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findOne({
      where: {
        email: email,
      },
    });

    // Si no se encuentra el usuario, devolver error de autenticación
    if (!usuario) {
      return res
        .status(401)
        .json(ApiResponse.getResponse(401, "Autenticación fallida", null));
    }

    // Comparar la contraseña enviada con la almacenada en la base de datos
    const matchPassword = await bcrypt.compare(password, usuario.password);

    // Verificar credenciales
    if (email === usuario.email && matchPassword) {
    
      // Generar token JWT y devolverlo como cookie
      const usuario = await Usuario.findOne({ where: { email: email } });
      const token = crearToken(email, usuario.rol);
      
      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.SECURE,
          sameSite: "None",
          maxAge: 1000 * 60 * 60,
        })
        .status(200)
        .json(
          ApiResponse.getResponse(200, "Autenticado correctamente", {
            nombre: usuario.nombre,
          })
        );

    } else {

      //Si las credenciales no coinciden
      return res
        .status(401)
        .json(ApiResponse.getResponse(401, "Autenticación fallida", null));

    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(ApiResponse.getResponse(500, "Error interno del servidor", null));
  }
};

/**
 * Controlador para cerrar sesión del usuario.
 * - Elimina la cookie de autenticación (token).
 *
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 * @returns {Response} JSON confirmando el cierre de sesión o error.
 */
const logout = async (req, res) => {
  try {
    // Eliminar la cookie del token en el cliente
    res.clearCookie("token", {
      httpOnly: true,                // Solo accesible desde el servidor
      secure: process.env.SECURE,   // Solo se envía por HTTPS si está activado
      sameSite: "None",             // Permitir envío entre sitios (necesario si frontend y backend están en dominios distintos)
    });

    //Respuesta exitosa
    res.status(200).json(ApiResponse.getResponse(200, "Logout exitoso", null));

  } catch (error) {
    // Error interno del servidor
    console.log(error);
    res
      .status(500)
      .json(ApiResponse.getResponse(500, "Error interno del servidor", null));
  }
};

/**
 * Controlador para comprobar si el usuario tiene una sesión activa.
 * - Verifica que el token JWT exista y sea válido.
 * - Confirma que el usuario aún exista en la base de datos.
 *
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 * @returns {Response} JSON verificando si existe sesión abierta.
 */
const isAuth = async (req, res) => {
  try {
    //Obtener el token desde las cookies
    const token = req.cookies.token;

    //Si no hay token, se considera no autenticado
    if (!token) {
      return res
        .status(401)
        .json(ApiResponse.getResponse(401, "Token no existe", false));
    }

    //Verifica la validez del token
    const payload = jwt.verify(token, process.env.JWT_KEY);

    //Buscar el usuario en la base de datos con el email del token
    const usuarioEncontrado = await Usuario.findOne({
      where: { email: payload.usuario },
    });

    //Si no se encuentra el usuario, el token no es válido
    if (!usuarioEncontrado) {
      return res
        .status(403)
        .json(ApiResponse.getResponse(403, "Token inválido", false));
    }

    // Token válido y usuario existente
    res.status(200).json(ApiResponse.getResponse(200, "Token válido", true));

  } catch (error) {
    // Error puede ser por token vencido, manipulado, etc.
    console.log(error);
    res.status(500).json(ApiResponse.getResponse(500, "Error al verificar el token", false));
  }
};

/**
 * - Verifica si existe un token y lo valida
 * - Confirma que el usuario aún exista en la base de datos
 * 
 * @param {Request} req - Objeto de solicitud de express
 * @param {Response} res -  Objeto de respuesta de express
 * @returns {Response} - JSON con el rol del usuario autenticado o error.
 */
const getRoleLoginUser = async (req, res) => {
  try {
    // Obtener el token desde las cookies
    const token = req.cookies.token;

    // Si no hay token, el usuario no está autenticado
    if (!token) {
      return res
        .status(401)
        .json(ApiResponse.getResponse(401, "Token no proporcionado", false));
    }

    // Verificar la validez del token y extraer el payload
    const payload = jwt.verify(token, process.env.JWT_KEY);

    // Buscar el usuario en la base de datos usando el email del token
    const usuarioEncontrado = await Usuario.findOne({
      where: { email: payload.usuario },
    });

    // Si no se encuentra el usuario, el token ya no es válido
    if (!usuarioEncontrado) {
      return res
        .status(403)
        .json(ApiResponse.getResponse(403, "Token inválido: Usuario no encontrado", false));
    }

    // Token válido, devolver el rol del usuario
    res
      .status(200)
      .json(ApiResponse.getResponse(200, "Token válido", usuarioEncontrado.rol));

  } catch (error) {
    // Cualquier error (token vencido, mal formado, etc.)
    console.log(error);
    res.status(500).json(ApiResponse.getResponse(500, "Error al verificar token", false));
  }
};

export { login, logout, isAuth, getRoleLoginUser };
