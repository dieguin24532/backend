import { Eventos, Tickets } from "../models/db/index.js";
import PostsMeta from "../models/db_wordpress/Post-meta.js";
import Posts from "../models/db_wordpress/Posts.js";
import { Op, Sequelize } from "sequelize";

export class eventoService {
  static async obtenerEventoDetalleById(eventoId) {
    return await PostsMeta.findAll({
      where: {
        post_id: eventoId,
        meta_key: {
          [Op.or]: ["event_date_time", "event_end_date_time", "event_location"],
        },
      },
    });
  }

  static async obtenerEventoById(idEvento) {
    return await Posts.findByPk(idEvento);
  }

  static async obtenerEventos() {
    return await await Eventos.findAll({
      attributes: [
        "id",
        "lugar",
        "nombre_evento",
        "fecha_inicio",
        "fecha_fin",
        "createdAt",
        "updatedAt",
        [Sequelize.fn("COUNT", Sequelize.col("tickets.id")), "tickets_totales"],
      ],
      include: [
        {
          model: Tickets,
          as: "tickets",
          attributes: [],
          required: false,
        },
      ],
      group: ["eventos.id"],
      raw: true,
    });
  }

  static async obtenerTicketsPorEventoYLocalidad() {
    // Primero agregamos tickets por evento y localidad
    const ticketsAgrupados = await Tickets.findAll({
      attributes: [
        "evento_id",
        "localidad",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "cantidad"],
      ],
      group: ["evento_id", "localidad"],
    });

    // Creamos un objeto intermedio para mapear tickets por evento
    const ticketsPorEvento = {};
    ticketsAgrupados.forEach((ticket) => {
      const { evento_id, localidad, cantidad } = ticket.toJSON();
      if (!ticketsPorEvento[evento_id]) ticketsPorEvento[evento_id] = {};
      ticketsPorEvento[evento_id][localidad] = parseInt(cantidad);
    });

    console.log(ticketsPorEvento)

    // Obtenemos todos los eventos
    const eventos = await Eventos.findAll({
      attributes: [
        "id",
        "lugar",
        "nombre_evento",
        "fecha_inicio",
        "fecha_fin",
        "createdAt",
        "updatedAt",
        [Sequelize.fn("COUNT", Sequelize.col("tickets.id")), "tickets_totales"],
      ],
      include: [
        {
          model: Tickets,
          as: "tickets",
          attributes: [],
          required: false,
        },
      ],
      group: ["eventos.id"],
      raw: true
    });

    // Mapear tickets agregados a cada evento
    return eventos.map((evento) => {
      return {
        id: evento.id,
        nombre_evento: evento.nombre_evento,
        lugar: evento.lugar,
        fecha_inicio : evento.fecha_inicio,
        fecha_fin : evento.fecha_fin,
        tickets_totales: evento.tickets_totales,
        tickets_localidad: ticketsPorEvento[evento.id] || {},
      };
    });
  }

  static async armarEvento(eventoId) {
    const evento = await this.obtenerEventoById(eventoId);
    const eventoDetalle = await this.obtenerEventoDetalleById(eventoId);

    return {
      id: eventoId,
      nombre_evento: evento.get("post_title"),
      fecha_inicio: eventoDetalle[0]?.get("meta_value"),
      fecha_fin: eventoDetalle[1]?.get("meta_value"),
      lugar: eventoDetalle[2]?.get("meta_value"),
    };
  }

  static async crearOBuscarEvento(evento, transaction) {
    return await Eventos.findOrCreate({
      where: { ID: evento.id },
      defaults: evento,
      transaction: transaction,
    });
  }
}
