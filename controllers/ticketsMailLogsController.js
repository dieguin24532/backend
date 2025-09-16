import { TicketsEmailLogs } from "../models/db/index.js";
import { ApiResponse } from "../dtos/ApiResponseDTO.js";

/**
 * Almacena un log de eventos de email recibido desde un webhook
 * - Registra el evento si no existe previamente en la base de datos 
 */
async function almacenarLogs(req, res) {
  try {
    // Obtiene el primer evento del arreglo recibido (asume que es un array de eventos)
    const responseHook = req.body[0];

    // Convierte el timestamp UNIX (segundos) a formato Date
    const timestampMilisegundos = responseHook.timestamp * 1000;
    const fecha = new Date(timestampMilisegundos);

     // Construye el objeto que representa el log de email
    const emailLog = {
      id: responseHook.sg_event_id,
      ticket_id: responseHook.correo_id,
      evento_nombre: responseHook.event,
      timestamp: fecha,
      email: responseHook.email
    };

    // Inserta el log solo si no existe previamente
    const [ticketLog, created] = await TicketsEmailLogs.findOrCreate({
        where: {
            id: emailLog.id
        },
        defaults: emailLog
    });

    if(created) {
        console.log('Insertado correctamente');
        res.status(200).json(ApiResponse.getResponse(200, 'Insertado correctamente', ticketLog))
    } else {
        console.log('Registro ya existe');
        res.status(200).json(ApiResponse.getResponse(200, 'Registro ya existe', ticketLog))
    }

  } catch (error) {
    console.log(error);
    res.status(500).json(ApiResponse.getResponse(500, 'Error interno en el servidor', null))
  }
}


/**
 * Devuelve todos los logs de eventos de email relacionados a un ticket.
 * - Se filtra por `ticket_id` recibido como parámetro en la URL.
 */
async function obtenerLogsByTicketID(req, res) {

  try {

    const ticketId = req.params.id;
 
    const emailLogs = await TicketsEmailLogs.findAll({
     where: {
       ticket_id: ticketId
     }
    })
 
    res.status(200).json(ApiResponse.getResponse(200, 'Logs obtenidos', emailLogs))
    
  } catch (error) {
    console.log(error);
    res.status(500).json(ApiResponse.getResponse(500, 'Erro interno en el servidor', null))
  }
}

export { almacenarLogs, obtenerLogsByTicketID };
