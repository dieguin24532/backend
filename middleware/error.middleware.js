import { ApiResponseHelper } from "../helpers/apiResponse.js";

const errorHandler = (err, req, res, next) => {
    const estado = err.status || 500;
    const mensaje = err.message || "Error interno en el servidor";

    return res.status(estado).json(ApiResponseHelper.error(mensaje, estado));
}

export { errorHandler };