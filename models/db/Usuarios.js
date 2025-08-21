import { DataTypes } from "sequelize";
import { v4 as uiidv4 } from "uuid";
import db from "../../config/db.js";
import bcrypt from "bcrypt";

const Usuario = db.define('usuarios', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => uiidv4()
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    hooks: {
        beforeCreate: async (usuario) => {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    }
}
);

export default Usuario