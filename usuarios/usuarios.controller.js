import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator"
import { UsuariosService } from "./usuarios.service.js";
import { usuarioLoginDTO, usuarioPublicoDTO } from "./dto/usuario.response.js";
import { ApiResponseHelper } from "../helpers/api.response.js";
import { mapearErrores } from "../helpers/errores.js";

/**
 * Crea un nuevo usuario si el email no está registrado
 */
const guardarUsuario = async (req, res) => {
  try {
    await check("nombre")
      .notEmpty().withMessage("El nombre es obligatorio")
      .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres")
      .run(req);

    await check("email")
      .notEmpty().withMessage("El email es obligatorio")
      .isEmail().withMessage("El campo debe ser un mail válido")
      .run(req);

    await check("password")
      .notEmpty().withMessage("La contraseña es obligatoria")
      .isLength({ min: 8, max: 24 }).withMessage("La contraseña debe tener entre 8 y 24 caracteres")
      .run(req);

    await check("rol")
      .notEmpty().withMessage("El rol es obligatorio")
      .isInt().withMessage("El campo es un número")
      .run(req);

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      const erroresMapedos = mapearErrores(errores);
      return res.status(422).json(ApiResponseHelper.getResponse(422, 'Campos no válidos', erroresMapedos));
    }

    // Usar servicio para buscar o crear usuario
    const [usuario, esNuevo] = await UsuariosService.buscarOCrearUsuario(
      req.body.email,
      req.body
    );

    if (esNuevo) {
      console.log('Usuario insertado correctamente');
      return res.status(200).json(ApiResponseHelper.getResponse(200, "Usuario creado con éxito", usuario));
    } else {
      console.log('El email ya está registrado');
      return res.status(409).json(ApiResponseHelper.getResponse(409, 'El correo ya se encuentra registrado', null));
    }

  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Error interno del servidor";
    console.error("Error en guardarUsuario:", error);
    return res.status(statusCode).json(ApiResponseHelper.getResponse(statusCode, message, null));
  }
};


/**
 * Retorna todos los usuarios registrados (formateados con DTO)
 */
const obtenerUsuarios = async (req, res) => {
  try {
    // Usar servicio para obtener todos los usuarios
    const usuarios = await UsuariosService.obtenerTodos();

    if (usuarios.length === 0) {
      return res.status(200).json(ApiResponseHelper.getResponse(200, "No existen usuarios", null));
    }

    // Aplicar DTO usuarioPublico a los usuarios
    const usuariosFormateados = usuarios.map((usuario) =>
      usuarioPublicoDTO(usuario)
    );

    res.status(200).json(
      ApiResponseHelper.getResponse(200, "Usuarios encontrados", usuariosFormateados)
    );

  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Error interno del servidor";
    console.error("Error en obtenerUsuarios:", error);
    return res.status(statusCode).json(ApiResponseHelper.getResponse(statusCode, message, null));
  }
};


/**
 * Retorna el usuario autenticado a partir del token
 */
const obtenerUsuarioLogin = async (req, res) => {
  try {
    // Verifica el token
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json(ApiResponseHelper.getResponse(401, "Token no proporcionado", null));
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
      return res.status(403).json(ApiResponseHelper.getResponse(403, "Token inválido o expirado", null));
    }

    // Usar servicio para obtener el usuario
    const usuario = await UsuariosService.obtenerPorEmail(payload.usuario);

    if (!usuario) {
      return res.status(403).json(ApiResponseHelper.getResponse(403, "Usuario no encontrado", null));
    }

    res.status(200).json(ApiResponseHelper.getResponse(200, "Usuario encontrado", usuarioLoginDTO(usuario)));

  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Error interno del servidor";
    console.error("Error en obtenerUsuarioLogin:", error);
    return res.status(statusCode).json(ApiResponseHelper.getResponse(statusCode, message, null));
  }
};

export { guardarUsuario, obtenerUsuarios, obtenerUsuarioLogin };
