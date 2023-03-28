require("dotenv").config();

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER_NAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB
    }
});

knex.raw("SELECT 1").then(() => {
    console.log("MySQL connected");
}).catch((e) => {
    console.log("MySQL not connected");
    console.error(e);
});

module.exports = knex;