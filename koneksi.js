require('dotenv').config();
var mysql = require('mysql');

const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME
} = process.env;

//create db connection
const conn = mysql.createConnection({
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database:DB_NAME,
    port: DB_PORT
});

conn.connect((err)=>{
    if (err) throw err;
    console.log('Mysql Connect');
});

module.exports = conn;