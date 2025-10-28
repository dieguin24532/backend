const errorHandler = (err, req, res, next) => {
    const estado = err.status || 500;
    const mensaje = err.message || "Error interno en el servidor";

    switch(estado) {
        case 401:
            req.log.error(mensaje);
            return res.status(estado).json()
    }
}