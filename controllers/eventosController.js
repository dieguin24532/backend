import { isColString } from "sequelize/lib/utils";
import { ApiResponse } from "../dtos/ApiResponseDTO.js";
import { eventoService } from "../serviceLayer/eventosService.js";
import { eventoDTO } from "../dtos/eventoDTO.js";

async function obtenerEventos(req, res) {
    try {
        const eventos = await eventoService.obtenerEventos();

        if (eventos.length === 0) {
            return res
                .status(200)
                .json(ApiResponse.getResponse(200, "No se encontraron eventos"));
        }

        const eventosFormateados = eventos.map((evento) => eventoDTO(evento)
        );
        res
            .status(200)
            .json(ApiResponse.getResponse(200, "Eventos obtenidos", eventosFormateados));
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json(ApiResponse.getResponse(500, "Error interno del servidor", null));
    }
}

export { obtenerEventos };
