import { ApiResponse } from "../dtos/ApiResponseDTO.js";
import { enviarEmail } from "../helpers/emails.js";
import { ticketService } from "../serviceLayer/ticketsService.js";
import { generarEntradaPDF } from "../helpers/pdf.js";

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
        res.setHeader("Content-Disposition", "inline; filename = archivo.pdf");
        res.setHeader("Content-Type", "application/pdf");
        res.send(PDF);
    } catch (error) {
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

export { 
    obtenerTickets,
    verEntrada,
    enviarEntrada,
    obtenerTicketsByEvento 
};
