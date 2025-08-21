import { DataTypes } from "sequelize";
import db from "../../config/db.js";
import { v4 as uuidv4 } from "uuid";

const Tickets = db.define("tickets", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  evento_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "eventos",
      key: "id",
    },
  },
  pedido_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "pedidos",
      key: "id",
    },
  },
  codigo_qr: {
    type: DataTypes.TEXT,
  },
  etiqueta: {
    type: DataTypes.STRING,
  },
  localidad: {
    type: DataTypes.STRING,
  },
  correo_enviado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  escaneado_por: {
    type: DataTypes.STRING,

  }
});

export default Tickets;
