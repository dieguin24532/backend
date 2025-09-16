import { Sequelize } from "sequelize";
import { Pedidos, Tickets } from "../models/db/index.js";

export class pedidoService {

  /**
   * Llama al método del modelo oara insertar un pedido
   * @param pedido 
   * @returns
   */
  static async crearPedido(pedido, transaction ) {
    return await Pedidos.create({
      id: pedido.id,
      cliente: `${pedido.first_name} ${pedido.last_name}`,
      email: pedido.email,
      telefono: pedido.phone,
      ruc_cedula: pedido.ruc_cedula,
      cantidad: 15,
      total: pedido.total,
      impuesto: pedido.impuesto,
      descuento: pedido.descuento,
      metodo_pago: pedido.metodo_pago
    },
    {
      transaction: transaction
    });
  }


  static async obtenerPedidos() {
    return await Pedidos.findAll({
      attributes: [
        "id",
        "cliente",
        "email",
        "telefono",
        "ruc_cedula",
        "total",
        "impuesto",
        "descuento",
        "metodo_pago",
        [Sequelize.fn("COUNT", Sequelize.col("tickets.id")), "tickets_totales"]
      ],
      include: [
        {
          model: Tickets,
          as: "tickets",
          attributes: [],
          required: false
        }
      ],
      group: ["pedidos.id"],
      raw: true
    });
  }

  static async eliminarPedido(pedido) {
    return await Pedidos.destroy({
      where: {
        id: pedido.id
      }
    })
  }

}