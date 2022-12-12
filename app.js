const express = require('express');
const mysql = require('mysql2');
const conexao = require('./conexao.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.post('/register', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    
    const con = conexao.getConnection();
    con.query(`SELECT * FROM usuario WHERE email='${req.body.email}'`, (error, results, fields) => {
        if (error) {
            res.json(error);
        } else {
            if (results.length > 0) {
                res.json(false);
            } else {
                bcrypt.genSalt(saltRounds, function (err, salt) {
                    bcrypt.hash(req.body.senha, salt, function (err, hash) {
                        con.query(`INSERT INTO usuario (nome, email, senha) VALUES('${req.body.nome}', '${req.body.email}', '${hash}')`, (error, results, fields) => {
                            if (error) res.json(error);
                            else res.json(results);
                        });
                        
                    })
                })
            }
        }
    })

})

app.get('/login/:email/:senha', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    const con = conexao.getConnection();
    con.query(`SELECT * FROM usuario WHERE email='${req.params.email}'`, (error, results, fields) => {
        if (error) {
            res.json(error);
        } else {
            if (results.length === 0) {
                res.json(false);
            } else {
                bcrypt.compare(req.params.senha, results[0].senha, (error, result) => {
                    res.json(result);
                })
            }
        }
        con.end();
    })
})

app.get('/products', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    const con = conexao.getConnection();
    con.query(`SELECT * FROM produtos`, (error, results, fields) => {
        if (error) {
            res.json(false);
        } else {
            res.json(results);
        }
    })
})

app.post('/products', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    const con = conexao.getConnection();
    con.query(`INSERT INTO produtos (produto, armazenamento, valor, img_url) VALUES ('${req.body.produto}','${req.body.armazenamento}','${req.body.valor}','${req.body.img_url}')`, (error, results, fields) => {
        if (error) {
            res.json(error);
        } else {
            res.json(results);
        }
    })
})

app.put('/products/:id', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    const con = conexao.getConnection();
    con.query(`UPDATE produtos SET produto='${req.body.produto}', armazenamento='${req.body.armazenamento}', valor=${req.body.valor} WHERE id='${req.params.id}'`, (error, results, fields) => {
        if (error) {
            res.json(error);
        } else {
            res.json(results);
        }
    })
})

app.delete('/products/:id', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    const con = conexao.getConnection();
    con.query(`DELETE FROM produtos WHERE id='${req.params.id}'`, (error, results, fields) => {
        if (error) {
            res.json(error);
        } else {
            res.json(results);
        }
    })
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));