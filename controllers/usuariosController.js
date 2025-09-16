import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator"
//
import Usuario from "../models/db/Usuarios.js";
import { usuarioLoginDTO, usuarioPublicoDTO } from "../dtos/usuarioDTO.js";
import { ApiResponse } from "../dtos/ApiResponseDTO.js";
import { mapearErrores } from "../helpers/errores.js";

/**
 * Crea un nuevo usuario si el email no está registrado
 */
const guardarUsuario = async (req, res) => {
  try {

    await check("nombre")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isLength({ min: 3 }). withMessage("El nombre debe tener al menos 3 caracteres")
        .run(req);

    await check("email")
        .notEmpty().withMessage("El email es obligatorio")
        .isEmail().withMessage("El campo debe ser un mail válido")
        .run(req);

    await check("password")
        .notEmpty().withMessage("La contraseña es obligatoria")
        .isLength( {min: 8, max: 24}).withMessage("La contraseña debe tener entre 8 y 24 caracteres")
        .run(req)

    await check("rol")
      .notEmpty().withMessage("El rol es obligatorio")
      .isInt().withMessage("El campo es un número")
      .run(req)


    let errores = validationResult(req);//Almacena las respuesta con los errores

    // Mapea los errores para no exponer información sensible
    if (!errores.isEmpty()) {
      const erroresMapedos = mapearErrores(errores);
      return res.status(422).json(ApiResponse.getResponse(422, 'Campos no válidos', erroresMapedos))
    }
    
    //Buscar o crear usuario
    const [ usuario, created] = await Usuario.findOrCreate({
      where: {
        email : req.body.email
      },
      defaults: req.body
    });

    //Devolución de respuestas
    if (created) {
      
      console.log('Insertado correctamente');
      res.status(200).json(ApiResponse.getResponse(200, "Usuario creado con éxito", usuario))
    
    } else {
      
      console.log('Registro ya existe');
      res.status(409).json(ApiResponse.getResponse(409, 'El correo ya se encuentra registrado', null));
    
    }

  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(ApiResponse.getResponse(500, "Error interno del servidor", null));
  }
};


/**
 * Retorna todos los usuarios registrados (formateados con DTO)
 */
const obtenerUsuarios = async (req, res) => {
  try {

    const usuarios = await Usuario.findAll();

    //Verificar el tamaño del array
    if (usuarios.length === 0) {
      return res
        .status(200)
        .json(ApiResponse.getResponse(200, "No existen usuarios", null));
    }

    //Aplicar DTO usuarioPublico a los usuarios
    const usuariosFormateados = usuarios.map((usuario) =>
      usuarioPublicoDTO(usuario)
    );


    res
      .status(200)
      .json(
        ApiResponse.getResponse(
          200,
          "Usuarios encontrados",
          usuariosFormateados
        )
      );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(ApiResponse.getResponse(500, "Error interno del servidor", null));
  }
};


/**
 * Retorna el usuario autenticado a partir del token
 */
const obtenerUsuarioLogin = async (req, res) => {
  try {

    //Verifica el token
    const token = req.cookies.token;
    const payload = jwt.verify(token, process.env.JWT_KEY);

    //Busca el usuario
    const usuario = await Usuario.findOne({
      where: {
        email: payload.usuario,
      },
    });


    if (!usuario) {
      res
        .status(403)
        .json(ApiResponse.getResponse(403, "Token inválido", null));
    }

    res.status(200).json(ApiResponse.getResponse(200, "Usuario encontrado", usuarioLoginDTO(usuario)));
  
  } catch (error) {
    console.log(error);
    return res.status(403).json(ApiResponse.getResponse(403, "Token inválido"));
  }
};

export { guardarUsuario, obtenerUsuarios, obtenerUsuarioLogin };
