export function eventoDTO(evento) {
    return {
        id: evento.id,
        lugar: evento.lugar,
        nombre_evento: evento.nombre_evento,
        tickets_totales: evento.tickets_totales,
        fecha_inicio: evento.fecha_inicio,
        fecha_fin: evento.fecha_fin,
    }
}