import Eventos from "./Eventos.js";
import Tickets from "./Tickets.js";
import Pedidos from "./Pedidos.js";
import Localidades from "./Localidades.js";
import TicketsEmailLogs from "./TicketsEmailLogs.js"

Eventos.hasMany(Tickets, {
  foreignKey: "evento_id",
  sourceKey: "id",
  as: "tickets",
});

Tickets.belongsTo(Eventos, {
  foreignKey: "evento_id",
  targetKey: "id",
  as: "evento",
});

Pedidos.hasMany(Tickets, {
  foreignKey: 'pedido_id',
  targetKey: 'id',
  as: 'tickets',
  onDelete: 'CASCADE'
})

Tickets.belongsTo(Pedidos, {
  foreignKey: "pedido_id",
  targetKey: "id",
  as: "pedido",
});

Tickets.hasMany(TicketsEmailLogs, {
  foreignKey: "ticket_id",
  targetKey: "id",
  as: "tickets_log",
  onDelete: 'CASCADE'
})

TicketsEmailLogs.belongsTo(Tickets, {
  foreignKey: "ticket_id",
  targetKey: "id",
  as: "pedido"
})

Localidades.hasMany(Tickets, {
  foreignKey: "localidad_id",
  targetKey: "id",
  as: "tickets"
})

Tickets.belongsTo(Localidades, {
  foreignKey: "localidad_id",
  targetKey: "id",
  as: "localidad"
})

export { Eventos, Tickets, Pedidos, TicketsEmailLogs, Localidades };
