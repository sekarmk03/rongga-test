var mysql = require('mysql');

//create db connection
const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'rongga_db'
});

conn.connect((err)=>{
    if (err) throw err;
    console.log('Mysql Connect');
});

module.exports = conn;