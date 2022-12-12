const mysql = require('mysql2');

exports.getConnection = () => {
    return mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'projetonode',
        database: 'mydb',
    });
}