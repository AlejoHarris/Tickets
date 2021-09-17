require('dotenv').config()

import { Sequelize } from 'sequelize'

const dbUser = process.env.DB_USER
const dbHost = process.env.DB_HOST
const dbPass = process.env.DB_PASS
const dbName = process.env.DB_NAME

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: 'mysql',
    pool: {
        max: 100,
        min: 0,
        idle: 200000,
        acquire: 1000000,
    }
})

sequelize.authenticate()
//sequelize.sync({force: true})

export default sequelize;