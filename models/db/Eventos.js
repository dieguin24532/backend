import { DataTypes } from "sequelize";

import db from "../../config/db.js";

const Eventos = db.define('eventos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    lugar: DataTypes.STRING,
    nombre_evento: DataTypes.STRING,
    fecha_inicio: DataTypes.DATE,
    fecha_fin: DataTypes.DATE
});

export default Eventos;