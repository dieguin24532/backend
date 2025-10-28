const ApiResponse = {
    success: (datos, mensaje = "Operacion exitosa") => ({
        success: true,
        mensaje,
        datos
    }),

    error: (mensaje = "Error interno en el servidor") => ({
        success: false,
        mensaje,
    })
}