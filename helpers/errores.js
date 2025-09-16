/**
 * Mapea los errores del ExpressValidator, evita mostrar información sensible de los datos
 */
const mapearErrores = (errores) => {
    const erroresMapeados = {}

    errores.array().forEach(error => {
        
        if (!erroresMapeados[error.path]) {
            erroresMapeados[error.path] = [];
        }
        
        erroresMapeados[error.path].push(error.msg);
    });

    return erroresMapeados;
}

export { mapearErrores }