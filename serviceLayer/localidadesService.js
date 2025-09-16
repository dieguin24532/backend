import { where } from "sequelize";
import PostsMeta from "../models/db_wordpress/Post-meta.js";
import Posts from "../models/db_wordpress/Posts.js";
import { Op } from "sequelize";
import Localidades from "../models/db/Localidades.js";
import { buscarMetaKey } from "../helpers/utils.js";

export class localidadService {
  static async armarLocalidad(localidadId) {
    const localidad = await Posts.findByPk(localidadId);
    const localidadDetalle = await PostsMeta.findAll({
      where: {
        post_id: localidadId,
        meta_key: {
          [Op.or]: ["_regular_price"],
        },
      },
    });

    const _regular_price = buscarMetaKey(localidadDetalle, "_regular_price");

    return {
      id: localidad.id,
      nombre: localidad.post_title,
      precio: _regular_price,
    }
  }

  static async crearOBuscarLocalidad(localidad, transaction) {
    return await Localidades.findOrCreate({
      where: { id: localidad.id },
      defaults: localidad,
      transaction: transaction,
    });
  }
}
