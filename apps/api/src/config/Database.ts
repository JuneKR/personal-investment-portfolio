import { Sequelize } from "sequelize";

const db = new Sequelize('auth_db', 'root', 'mysql@Admin007', {
    host:"localhost",
    dialect: "mysql",
})

export default db;