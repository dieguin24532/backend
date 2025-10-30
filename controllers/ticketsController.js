import { ApiResponse } from "../dtos/ApiResponseDTO.js";
import { enviarEmail } from "../helpers/emails.js";
import { ticketService } from "../serviceLayer/ticketsService.js";
import { generarEntradaPDF } from "../helpers/pdf.js";
import Tickets from "../models/db/Tickets.js";
import Eventos from "../models/db/Eventos.js";
import { ApiResponseHelper } from "../helpers/apiResponse.js";

/**
 * Obtiene todos los ticketes registrados.
 * Si existen, transforma el campo `correo_enviado` a booleano explícito
 */
async function obtenerTickets(req, res) {
    try {
        const tickets = await ticketService.obtenerTickets();   
        
        if (tickets.length != 0) {
            const tickets2 = tickets.map(element => {
                return {
                    ...element,
                    correo_enviado: !!element.correo_enviado
                }
            });
            res
                .status(200)
                .json(ApiResponse.getResponse(200, "Tickets encontrados", tickets2));
            return;
        }

        res.status(200)
            .json(ApiResponse.getResponse(200, "No existen tickets", tickets));
            
    } catch (error) {
        console.log(error);
        res.status(500)
            .json(ApiResponse.getResponse(500, "Error interno del servidor", null));
    }
}

/**
 * Obtiene los tickets asociados a un evento específico.
 * Transforma el campo `correo_enviado` a booleano explícito.
 */
async function obtenerTicketsByEvento(req, res) {
    const ticketId = req.params.id;
    try {
        const tickets = await ticketService.obtenerTicketsByEvento(ticketId);
        
        if (tickets.length != 0) {
            const ticketsMapeados = tickets.map(element => {
                return {
                    ...element,
                    correo_enviado: !!element.correo_enviado
                }
            });
            res
                .status(200)
                .json(ApiResponse.getResponse(200, "Tickets encontrados", ticketsMapeados));
            return;
        }

        res.status(200)
            .json(ApiResponse.getResponse(200, "No existen tickets", tickets));
            
    } catch (error) {
        console.log(error);
        res.status(500)
            .json(ApiResponse.getResponse(500, "Error interno del servidor", null));
    }
}

/**
 * Devuelve el archivo PDF generado para un ticket específico.
 * Establece cabeceras para mostrar el PDF en línea.
 */
async function verEntrada(req, res) {
    try {
        const ticketId = req.params.id;
        const PDF = await generarEntradaPDF(ticketId);

        // Generar un nombre de archivo dinámico, por ejemplo:
        const fileName = `ticket_${ticketId}_${Date.now()}.pdf`;

        res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
        res.setHeader("Content-Type", "application/pdf");
        res.send(Buffer.from(PDF));
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json(ApiResponse.getResponse(500, "Error interno del servidor", null));
    }
}

/**
 * Genera el PDF de un ticket y lo envía por correo electrónico.
 * Actualiza el campo `correo_enviado` del ticket una vez enviado.
 */
async function enviarEntrada(req, res) {
    try {
        const ticketId = req.params.id;
        const ticket = await ticketService.obtenerTicketById(ticketId);
        const PDF = await generarEntradaPDF(ticketId);
        await enviarEmail(PDF, ticket);
        await ticketService.actualizarTicket({id: ticketId, correo_enviado: true}, null);
        res.status(200).json(ApiResponse.getResponse(200, "Correo enviado correctamente", null))
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json(ApiResponse.getResponse(500, "Error interno del servidor", null));
    }
}

async function validarEntrada(req, res) {
    try {
        // Solicita el id_evento, id_ticket
        const { ticket_id, evento_id } = req.body;
        // Verificar que existe el evento
        const existeEvento = await Eventos.findByPk(evento_id);

        if(!existeEvento) {
            return res.status(404).json(ApiResponseHelper.error(404, 'EVENT_NOT_FOUND' , "El evento no existe", ));
        }

        // Verificar si el ticket pertenece al evento
        const ticket = await Tickets.findOne({
            where: {
                evento_id: evento_id,
                id: ticket_id
            }
        })

        if(!ticket) {
            return res.status(404).json(ApiResponseHelper.error(404, 'EVENT_DONT_HAVE_TICKET', "El ticket no existe en este evento"));
        }
        
        // Verificar si ya esta escaneado
        if(ticket.escaneado) {
           return res.status(409).json(ApiResponseHelper.error(409, 'TICKET_ALREADY_SCANNED', "El ticket ya fue escaneado previamente", {asiento: ticket.etiqueta}))
        }

        ticket.escaneado = 1;
        await ticket.save();

        return res
            .status(200)
            .json(ApiResponseHelper.success(200, "Codigo escaneado correctamente"));

    } catch (error) {
        console.log(error);
        return res.status(500).json(ApiResponse.getResponse(500, "Error interno del servidor", null))
    }
}

export { 
    obtenerTickets,
    verEntrada,
    enviarEntrada,
    obtenerTicketsByEvento,
    validarEntrada
};
