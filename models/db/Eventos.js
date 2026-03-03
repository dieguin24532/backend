import { DataTypes } from "sequelize";

import db from "../../core/config/db.js";

const Eventos = db.define('eventos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    lugar: DataTypes.STRING,
    nombre_evento: DataTypes.STRING,
    fecha_inicio: DataTypes.DATE,
    fecha_fin: DataTypes.DATE,
    activo: DataTypes.BOOLEAN,
    imagen: DataTypes.STRING,
    cuerpo_email: DataTypes.STRING
});

export default Eventos;