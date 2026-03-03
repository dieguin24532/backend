import { DataTypes } from "sequelize";
import dbTickets from "../../core/config/db_wordpress.js";

const Posts = dbTickets.define('wp_posts', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    post_title: {
        type: DataTypes.STRING
    }
})

export default Posts;