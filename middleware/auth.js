import { ApiResponse } from "../dtos/ApiResponseDTO.js";
import jwt from "jsonwebtoken";
import Usuario from "../models/db/Usuarios.js";

const verificarToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json(ApiResponse.getResponse(401, "Token no existe", null));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY);
    req.usuario = payload.usuario;
    const usuarioEncontrado = await Usuario.findOne({
      where: { email: req.usuario },
    });
    if (!usuarioEncontrado) {
      res
        .status(403)
        .json(ApiResponse.getResponse(403, "Token inválido", null));
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json(ApiResponse.getResponse(403, "Token inválido"));
  }
};

export { verificarToken };
