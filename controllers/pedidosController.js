import { ApiResponse } from "../dtos/ApiResponseDTO.js";
import Pedidos from "../models/db/Pedidos.js";
import { ordenService } from "../serviceLayer/ordenService.js";
import { pedidoService } from "../serviceLayer/pedidosService.js";

/**
 * Procesa la actualización de un pedido desde una fuente externa (e.g. WooCommerce).
 * - Si el estado del pedido es "completed", se genera una orden.
 * - Si no, se elimina la orden correspondiente.
 */
async function recibirActualizaciónPedido(req, res) {
  try {
    const data = req.body;

    // Extrae el RUC o cédula desde los metadatos del pedido
    const ruc_cedula = data.meta_data.find(
      (meta) => meta.key === "_billing_ruc_o_cedula"
    );

    // Estructura de datos del pedido a registrar o eliminar
    let pedido = {
      id: data.id,
      ruc_cedula: ruc_cedula.value,
      ...data.billing,
      total: data.total,
      impuesto: data.total_tax,
      descuento: data.discount_total,
      metodo_pago: data.payment_method_title
    };

    if (data.status == "completed") {
      // TODO: Este se encarga de generar la orden debo cancelarlo
      // Crea la orden si el pedido fue completado
      pedido = await ordenService.generarOrden(pedido);
      console.log("Insertado");
      return res
        .status(200)
        .json(
          ApiResponse.getResponse(200, "Pedido ingresado correctamente", pedido)
        );
    } else {
      // Elimina la orden si el pedido fue cancelado u otro estado
      pedido = await ordenService.eliminarOrden(pedido);
      console.log("Eliminado");
      return res
        .status(200)
        .json(
          ApiResponse.getResponse(200, "Pedido eliminado correctamente", pedido)
        );
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(ApiResponse.getResponse(500, "Error interno del servidor", null));
  }
}


/**
 * Obtiene todos los pedidos registrados.
 * Devuelve la lista completa o un mensaje si está vacía.
 */
async function obtenerPedidos(req, res) {
  
  try {
    const pedidos = await pedidoService.obtenerPedidos();

    if(pedidos.length === 0) {
      return res.status(200).json(ApiResponse.getResponse(200, 'No se encontraron pedidos' ,pedidos));
    }
    res.status(200).json(ApiResponse.getResponse(200, 'Pedidos obtenidos' ,pedidos));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(ApiResponse.getResponse(500, "Error interno del servidor", null));
  }
}


/**
 * Actualiza el correo electrónico de un pedido específico.
 */
async function actualizarEmail(req, res) {
  try {
    const pedido = req.body;
    
    const [ updatedRows] = await Pedidos.update(
      { email: pedido.email },
      {
        where: { id: pedido.id }
      }
    );

    res.status(200).json(ApiResponse.getResponse(200, 'Actualizado correctamente', updatedRows))
  } catch (error) {
    console.log(error);
  }
}

export { recibirActualizaciónPedido, obtenerPedidos, actualizarEmail };
