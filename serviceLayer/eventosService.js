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
        [Sequelize.fn("COUNT", Sequelize.col("tickets.id")), "tickets_totales"]
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
      raw: true, // ✅ esto entrega objetos planos con el campo "tickets"
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
