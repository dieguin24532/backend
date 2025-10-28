import { ApiResponse } from "../dtos/ApiResponseDTO.js";
import { crearToken } from "../helpers/tokens.js";
import Usuario from "../models/db/Usuarios.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import { mapearErrores } from "../helpers/errores.js";

/**
 * Autentica al usuario mediante email y contraseña.
 * Devuelve un token JWT en una cookie si las credenciales son válidas.
 */
const login = async (req, res) => {
  try {
    // Validaciones de los campos
    await check("email")
      .notEmpty()
      .withMessage("El email es obligatorio")
      .isEmail()
      .withMessage("Debe ser mail válido")
      .run(req);

    await check("password")
      .notEmpty()
      .withMessage("La contraseña es obligatoria")
      // .isLength({ min: 8, max: 24 })
      // .withMessage("La contraseña debe tener entre 8 y 24 caracteres")
      .run(req);

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

    const email = req.body.email;
    const password = req.body.password;

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

    const usuario = await Usuario.findOne({
      where: {
        email: email,
      },
    });

    if (!usuario) {
      return res
        .status(401)
        .json(ApiResponse.getResponse(401, "Autenticación fallida", null));
    }

    // Compara las credenciales
    const matchPassword = await bcrypt.compare(password, usuario.password);
    if (email === usuario.email && matchPassword) {
    
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
 * Cierra la sesión del usuario eliminando la cookie de autenticación.
 */
const logout = async (req, res) => {
  try {
    
    res.clearCookie("token", {
      httpOnly: true,                // Solo accesible desde el servidor
      secure: process.env.SECURE,   // Solo se envía por HTTPS si está activado
      sameSite: "None",             // Permitir envío entre sitios (necesario si frontend y backend están en dominios distintos)
    });

    res.status(200).json(ApiResponse.getResponse(200, "Logout exitoso", null));

  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(ApiResponse.getResponse(500, "Error interno del servidor", null));
  }
};


/**
 * Verifica si el token JWT es válido y el usuario existe.
 */
const isAuth = async (req, res) => {
  try {

    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json(ApiResponse.getResponse(401, "Token no existe", false));
    }

    const payload = jwt.verify(token, process.env.JWT_KEY);
    const usuarioEncontrado = await Usuario.findOne({
      where: { email: payload.usuario },
    });


    if (!usuarioEncontrado) {
      return res
        .status(403)
        .json(ApiResponse.getResponse(403, "Token inválido", false));
    }

    res.status(200).json(ApiResponse.getResponse(200, "Token válido", true));

  } catch (error) {

    console.log(error);
    res.status(500).json(ApiResponse.getResponse(500, "Error al verificar el token", false));
  }
};


/**
 * Devuelve el rol del usuario autenticado si el token es válido.
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

    const payload = jwt.verify(token, process.env.JWT_KEY);

    const usuarioEncontrado = await Usuario.findOne({
      where: { email: payload.usuario },
    });

    if (!usuarioEncontrado) {
      return res
        .status(403)
        .json(ApiResponse.getResponse(403, "Token inválido: Usuario no encontrado", false));
    }

    res
      .status(200)
      .json(ApiResponse.getResponse(200, "Token válido", usuarioEncontrado.rol));

  } catch (error) {
    console.log(error);
    res.status(500).json(ApiResponse.getResponse(500, "Error al verificar token", false));
  }
};

export { login, logout, isAuth, getRoleLoginUser };
