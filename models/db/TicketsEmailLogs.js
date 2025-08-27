import { DataTypes } from "sequelize";

import db from "../../config/db.js";


const TicketsEmailLogs = db.define('tickets_email_logs', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    ticket_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'tickets',
            key: 'id'
        }
    },
    evento_nombre: {
        type: DataTypes.STRING
    },
    timestamp: {
        type: DataTypes.DATE
    },
    email: {
        type: DataTypes.STRING
    }
})

export default TicketsEmailLogs