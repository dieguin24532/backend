
const ApiResponseHelper = {
    success: ( estado, mensaje = "Operacion exitosa", datos) => ({
        succes: true,
        estado: estado,
        mensaje,
        datos
    }),

    error: (estado, codigo, mensaje = "Error interno en el servidor", detalles = null) => ({
        succes : false,
        estado: estado,
        error : {
            codigo: codigo,
            mensaje: mensaje,
            detalles: detalles
        }
    })
}

export { ApiResponseHelper }