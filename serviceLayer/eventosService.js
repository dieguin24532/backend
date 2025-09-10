import { Eventos, Localidades, Tickets } from "../models/db/index.js";
import PostsMeta from "../models/db_wordpress/Post-meta.js";
import Posts from "../models/db_wordpress/Posts.js";
import { Op, Sequelize } from "sequelize";
import { ticketService } from "./ticketsService.js";
import { raw } from "mysql2";
import { buscarMetaKey } from "../helpers/utils.js";

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

    // Armar array final con detalles anidados
    const eventosConDetalle = await Promise.all(
      eventos.map(async (evento) => {
        const detalle_localidades = await ticketService.sumarTicketLocalidadByEvento(evento.id);
        return {
          ...evento,
          detalle_localidades,
        };
      })
    );
    return eventosConDetalle;
  }

  static async armarEvento(eventoId) {
    const evento = await this.obtenerEventoById(eventoId);
    const eventoDetalle = await this.obtenerEventoDetalleById(eventoId);
    return {
      id: eventoId,
      nombre_evento: evento.get("post_title"),
      fecha_inicio: buscarMetaKey(eventoDetalle, 'event_date_time'),
      fecha_fin: buscarMetaKey(eventoDetalle,"event_end_date_time"),
      lugar: buscarMetaKey(eventoDetalle,"event_location"),
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
