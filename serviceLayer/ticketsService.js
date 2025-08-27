import { raw } from "mysql2";
import { Eventos, Pedidos, Tickets } from "../models/db/index.js";
import PostsMeta from "../models/db_wordpress/Post-meta.js";
import Posts from "../models/db_wordpress/Posts.js";
import { Op, Sequelize, where } from "sequelize";

export class ticketService {
  static async crearTicket(ticket, transaction) {
    return await Tickets.create(ticket, {
      transaction: transaction,
    });
  }

  static async actualizarTicket(ticket, transaction) {
    return await Tickets.update(ticket, {
      where: {
        id: ticket.id,
      },
      transaction: transaction,
    });
  }

  static async obtenerTicketById(ticketId) {
    return await Tickets.findByPk(ticketId, {
      include: [{
        model: Pedidos,
        as: 'pedido',
        required: true
      },
      {
        model: Eventos,
        as: 'evento',
        required: true
      }],
      raw: false
    });
  }

  static async obtenerTickets() {
    return await Tickets.findAll({
      attributes: [
        "id",
        "evento_id",
        "pedido_id",
        "etiqueta",
        "localidad",
        "correo_enviado",
        "escaneado_por",
        [ Sequelize.col("evento.nombre_evento"), "nombre_evento"],
        [ Sequelize.col("pedido.cliente"), "cliente"]
      ], 
      include: [
        {
          model:Eventos,
          as: "evento",
          attributes: []
        },
        {
          model:Pedidos,
          as: "pedido",
          attributes: []
        }
      ],
      raw: true
    }
    );
  }

  static async obtenerTicketDetalleById(ticketId) {
    return await PostsMeta.findAll({
      where: {
        post_id: ticketId,
        meta_key: {
          [Op.or]: ["event_id", "seat_label", "ticket_type_id"],
        },
      },
    });
  }

  static async obtenerTicketsByPedido(pedidoId) {
    return await Posts.findAll({
      attributes: ["ID"],
      where: {
        post_parent: pedidoId,
      },
    });
  }
}
