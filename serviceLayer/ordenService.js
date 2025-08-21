import { eventoService } from "./eventosService.js";
import { ticketService } from "./ticketsService.js";
import { pedidoService } from "./pedidosService.js";
import db from "../config/db.js";
import { generarCodigoQR } from "../helpers/codigosQr.js";

export class ordenService {
  static async generarOrden(pedido) {
    const orden = await this.prepararDatosOrden(pedido);
    await this.insertarDatosOrden(orden);
  }

  static async eliminarOrden(pedido) {
    try {
      await pedidoService.eliminarPedido(pedido);
    } catch (error) {
      throw (error);
      
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

      // Inserta los tickets del pedido
      for (let ticket of orden.tickets) {
        let nuevoTicket = await ticketService.crearTicket(ticket, t);
        const codigoQr = await generarCodigoQR(nuevoTicket.id)
        await nuevoTicket.update({ codigo_qr: codigoQr }, { transaction: t });
      }

      await t.commit();
    } catch (error) {
      await t.rollback();
    }
  }

  /**
   * Arma la orden completa con pedido, tickets y eventos
   * y la devuelve como un objeto
   * @param orden
   */
  static async prepararDatosOrden(pedido) {
    let eventos = [];
    const tickets = await ticketService.obtenerTicketsByPedido(pedido.id);

    let ticketsConDetalle = await Promise.all(
      tickets.map(async (ticket) => {
        const detalleTicket = await ticketService.obtenerTicketDetalleById(
          ticket.get("ID")
        );

        const eventoId =
          detalleTicket
            .find((item) => item.get("meta_key") === "event_id")
            ?.get("meta_value") || null;

        const localidadId =
          detalleTicket
            .find((item) => item.get("meta_key") === "ticket_type_id")
            ?.get("meta_value") || null;

        const etiquetaAsiento =
          detalleTicket
            .find((item) => item.get("meta_key") === "seat_label")
            ?.get("meta_value") || null;

        const eventoInsertar = await eventoService.armarEvento(eventoId);

        if (!eventos.find((evento) => evento.id === eventoInsertar.id)) {
          eventos.push(eventoInsertar);
        }

        const ticketInsertar = {
          evento_id: eventoId,
          etiqueta: etiquetaAsiento,
          localidad: localidadId,
          pedido_id: pedido.id,
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
    };
  }
}
