import db from "../config/db.js";
import { eventoService } from "./eventosService.js";
import { ticketService } from "./ticketsService.js";
import { pedidoService } from "./pedidosService.js";
import { localidadService } from "./localidadesService.js";
import { generarCodigoQR } from "../helpers/codigosQr.js";
import { buscarMetaKey } from "../helpers/utils.js";

export class ordenService {
  static async generarOrden(pedido) {
    const orden = await this.prepararDatosOrden(pedido);
    await this.insertarDatosOrden(orden);
  }

  static async eliminarOrden(pedido) {
    try {
      await pedidoService.eliminarPedido(pedido);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Inserta el pedido en la base de datos
   * tomando como parametro la orden armada correctamente
   * @param orden
   */
  static async insertarDatosOrden(orden) {
    const t = await db.transaction();
    const pedido = orden.pedido;

    try {
      //Crear el pedido
      await pedidoService.crearPedido(pedido, t);

      // Inserta los eventos del pedido en caso de que aún no exista
      await Promise.all(
        orden.eventos.map(async (evento) => {
          await eventoService.crearOBuscarEvento(evento, t);
        })
      );

      // Inserta las localidades del
      await Promise.all(
        orden.localidades.map(async (localidad) => {
          await localidadService.crearOBuscarLocalidad(localidad, t);
        })
      );

      if(orden.tickets.lenght === 0 || !orden.tickets) {
        throw new Error("No existen tickets en el pedido")
      }
      // Inserta los tickets del pedido
      for (let element of orden.tickets) {
        let ticketCreado = await ticketService.crearTicket(element, t);
        const codigoQr = await generarCodigoQR(ticketCreado.id);
        ticketCreado = await ticketCreado.update(
          { codigo_qr: codigoQr },
          { transaction: t }
        );
      }

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  }

  /**
   * Arma la orden completa con pedido, tickets y eventos
   * y la devuelve como un objeto
   * @param orden
   */
  static async prepararDatosOrden(pedido) {
    try {
      let eventos = []; //Array que contiene las localidades de la orden
      let localidades = []; //Array que contiene las localidades de la orden
  
      const tickets = await ticketService.obtenerTicketsByPedido(pedido.id);
  
      let ticketsConDetalle = await Promise.all(
        tickets.map(async (ticket) => {
          const detalleTicket = await ticketService.obtenerTicketDetalleById(
            ticket.get("ID")
          );
  
          const eventoId = buscarMetaKey(detalleTicket, "event_id");
          const localidadId = buscarMetaKey(detalleTicket, "ticket_type_id");
          const etiquetaAsiento = buscarMetaKey(detalleTicket, "seat_label");
  
          const eventoInsertar = await eventoService.armarEvento(eventoId);
          const localidadInsertar = await localidadService.armarLocalidad(
            localidadId
          );
  
          if (!eventos.find((evento) => evento.id === eventoInsertar.id)) {
            eventos.push(eventoInsertar);
          }
  
          if (
            !localidades.find(
              (localidad) => localidad.id === localidadInsertar.id
            )
          ) {
            localidades.push(localidadInsertar);
          }
  
          const ticketInsertar = {
            evento_id: eventoId,
            etiqueta: etiquetaAsiento,
            _id: localidadId,
            pedido_id: pedido.id,
            localidad_id: localidadId
          };
  
          return {
            ...ticketInsertar,
          };
        })
      );
  
      return {
        pedido: pedido,
        tickets: ticketsConDetalle,
        eventos: eventos,
        localidades: localidades,
      };
      
    } catch (error) {
      console.log(error);
    }
  }
}
