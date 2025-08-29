import { ApiResponse } from "../dtos/ApiResponseDTO.js";
import { enviarEmail } from "../helpers/emails.js";
import { ticketService } from "../serviceLayer/ticketsService.js";
import { generarEntradaPDF } from "../helpers/pdf.js";


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

async function verEntrada(req, res) {
    try {
        const ticketId = req.params.id;
        const PDF = await generarEntradaPDF(ticketId);
        res.setHeader("Content-Disposition", "inline; filename =archivo.pdf");
        res.setHeader("Content-Type", "application/pdf");
        res.send(PDF);
    } catch (error) {
                res
            .status(500)
            .json(ApiResponse.getResponse(500, "Error interno del servidor", null));
    }

}

/**
 * Método que recibe como parametro en la url el id del ticket
 * obtiene toda la información del ticket, genera el PDF y envia el
 * correo 
 * @param {*} req 
 * @param {*} res 
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

export { obtenerTickets, verEntrada, enviarEntrada, obtenerTicketsByEvento };
