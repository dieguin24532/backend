import { DataTypes } from "sequelize";
import dbTickets from "../../config/db_wordpress.js";

const PostsMeta = dbTickets.define('dqgl_postmeta', {
    meta_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    post_id: DataTypes.INTEGER,
    meta_key: DataTypes.STRING,
    meta_value: DataTypes.STRING
})

export default PostsMeta;