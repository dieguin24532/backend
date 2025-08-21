import { DataTypes } from "sequelize";
import db from '../../config/db.js';

const Pedidos = db.define('pedidos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    cliente: DataTypes.STRING,
    email: DataTypes.STRING,
    telefono: DataTypes.STRING,
    ruc_cedula: DataTypes.STRING,
    cantidad: DataTypes.INTEGER,
    total: DataTypes.DECIMAL(10,2),
    impuesto: DataTypes.DECIMAL(10,2),
    descuento: DataTypes.DECIMAL(10,2),
    metodo_pago: DataTypes.STRING
})

export default Pedidos;