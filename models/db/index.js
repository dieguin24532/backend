import Eventos from "./Eventos.js";
import Tickets from "./Tickets.js";
import Pedidos from "./Pedidos.js";

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


export { Eventos, Tickets, Pedidos };
