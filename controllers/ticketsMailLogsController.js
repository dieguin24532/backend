import { response } from "express";
import { TicketsEmailLogs } from "../models/db/index.js";
import { ApiResponse } from "../dtos/ApiResponseDTO.js";

async function almacenarLogs(req, res) {
  try {
    const responseHook = req.body[0];
    const timestampMilisegundos = responseHook.timestamp * 1000;
    const fecha = new Date(timestampMilisegundos);

    const emailLog = {
      id: responseHook.sg_event_id,
      ticket_id: responseHook.correo_id,
      evento_nombre: responseHook.event,
      timestamp: fecha,
      email: responseHook.email
    };

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
