import { ApiResponse } from "../dtos/ApiResponseDTO.js";
import jwt from 'jsonwebtoken';


const verificarToken = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json(ApiResponse.getResponse(401, 'Token no existe', null));
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_KEY);
        req.usuario = payload.usuario;
        next();
    } catch (error) {
        return res.status(403).json(ApiResponse.getResponse(403, 'Token inválido'));
    }
}

export { verificarToken }