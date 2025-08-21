export function usuarioDTO(usuario) {
    return {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        password: usuario.password
    }
}

export function usuarioPublicoDTO(usuario) {
    return {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
    }
}