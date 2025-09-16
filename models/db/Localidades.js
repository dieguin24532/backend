import { DataTypes } from "sequelize";
import db from "../../config/db.js";

const Localidades = db.define('localidades', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey:true
    },
    nombre: DataTypes.STRING,
    precio: DataTypes.DECIMAL(10,2)
})

export default Localidades