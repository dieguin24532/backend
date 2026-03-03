import { DataTypes } from "sequelize";
import db from "../../core/config/db.js";
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
  localidad_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "localidades",
      key: "id"
    }
  },
  correo_enviado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  escaneado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  fecha_escaneo: {
    type: DataTypes.DATE,
    allowNull: true
  },
  escaneado_por: {
    type: DataTypes.STRING,
  }
});

export default Tickets;
