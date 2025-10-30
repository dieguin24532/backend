import { ApiResponse } from "../dtos/ApiResponseDTO.js";
import jwt from "jsonwebtoken";
import Usuario from "../models/db/Usuarios.js";

/**
 * Verifica el acceso de los usuarios a las rutas, por roles permitidos en cada una de los endpoints
 * @param {*} rolesPermitidos 
 * @returns 
 */
const verificarToken = (rolesPermitidos = []) => {
  return async (req, res, next) => {
    try {
      
      //Obtiene el token de la cookie
      const token = req.cookies.token;

      //Si no existe el token devuleve un mensaje
      if (!token) {
        return res
          .status(401)
          .json(ApiResponse.getResponse(401, "Token no proporcionado", null));
      }

      //Verifica el token
      const payload = jwt.verify(token, process.env.JWT_KEY);

      //Confirmar si el usuariuo aún existe ne la base de datos
      const usuarioEncontrado = await Usuario.findOne({
        where: { email: payload.usuario },
      });


      if (!usuarioEncontrado) {
        return res
          .status(403)
          .json(ApiResponse.getResponse(403, "Token inválido: usuario no encontrado", null));
      }

      console.log("roles"+rolesPermitidos);
      console.log(payload.rol);
      if(rolesPermitidos.length > 0 && !rolesPermitidos.includes(payload.rol)) {
        return res
                .status(403).json(ApiResponse.getResponse(403, "Acceso denegado: rol no autorizado", null));
      }

      next();
    } catch (error) {
      console.log(error);
      return res
        .status(403)
        .json(ApiResponse.getResponse(403, "Token inválido"));
    }
  };
};

export { verificarToken };
