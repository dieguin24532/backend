import { ApiResponse } from "../dtos/ApiResponseDTO.js";
import { eventoService } from "../serviceLayer/eventosService.js";

async function obtenerEventos(req, res) {
    try {

        const eventos = await eventoService.obtenerEventos();

        if (eventos.length === 0) {
            return res
                .status(200)
                .json(ApiResponse.getResponse(200, "No se encontraron eventos"));
        }


        res
            .status(200)
            .json(ApiResponse.getResponse(200, "Eventos obtenidos", eventos));
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json(ApiResponse.getResponse(500, "Error interno del servidor", null));
    }
}

export { obtenerEventos };
