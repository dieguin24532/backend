import { eventoService } from "./eventos.service.js";
import { ApiResponseHelper } from "../helpers/api.response.js";
import Tickets from "../models/db/Tickets.js";

/**
 * Obtiene todos los eventos registrados.
 * Devuelve un array de eventos o un mensaje si no hay resultados.
 */
async function obtenerEventos(req, res) {
    try {

        const eventos = await eventoService.obtenerEventos();

        res
            .status(200)
            .json(ApiResponseHelper.getResponse(200, eventos.length !== 0 ? "Eventos obtenidos" : "No hay Eventos", eventos));
    } catch (error) {
        console.log('Error en obtener eventos: ', error);
        res
            .status(500)
            .json(ApiResponseHelper.getResponse(500, "Error interno del servidor", null));
    }
}


async function validarEntrada(req, res) {
    try {
        const usuarioLogueado = req.usuario;
        const { idEvento, idTicket } = req.params;

        if (!idEvento || !idTicket) {
            return res.status(400).json(ApiResponseHelper.error(400, 'BAD_REQUEST', "Faltan los parámetros",));
        }

        const eventFound = await eventoService.obtenerEventoById(idEvento);
        if (!eventFound) {
            return res.status(404).json(ApiResponseHelper.error(404, 'BAD_REQUEST', "No existe el evento"));
        }

        const ticketFound = await Tickets.findOne({
            where: { id: idTicket, evento_id: idEvento },
        });
        if (!ticketFound) {
            return res.status(404).json(ApiResponseHelper.error(404, 'BAD_REQUEST', "El ticket no pertenece a este evento"));
        }
        
        if (ticketFound.escaneado) {
            return res.status(409).json(ApiResponseHelper.error(409, 'CONFLICT', "Ticket ya escaneado"));
        }

        ticketFound.escaneado_por = usuarioLogueado.nombre;
        ticketFound.escaneado = true;
        ticketFound.fecha_escaneo = Date.now();
        await ticketFound.save();

        return res.status(200).json(ApiResponseHelper.success(200, 'Tickect válidado con éxito', { 
            idEvento, 
            idEvento, 
            escaneado_por: usuarioLogueado.escaneado_por, 
            fecha_escaneo: ticketFound.fecha_escaneo 
        }));

    } catch (error) {
        console.log("Error al validar entrada:", error);
        return res.status(500).json(ApiResponse.getResponse(500, "Error interno del servidor", null))
    }
}

export { obtenerEventos, validarEntrada };
