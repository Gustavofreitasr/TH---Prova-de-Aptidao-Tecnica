// Pacote do MySQL para rodar com o Node.js
const mysql = require('mysql2');
require('dotenv').config();


// Conexão com o meu banco de dados criado no Mysql
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Função para informar sobre a conexão ter tido sucesso ou não
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conexão com MySQL estabelecida.');
});

// Responsável por liberar que outros arquivos possam importar e interagir com o DB
module.exports = connection;
