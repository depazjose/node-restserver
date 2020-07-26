const express = require('express');
const fs = require('fs');
const path = require('path');
let app = express();

const { verificaTokenFromUrl } = require('../middlewares/autenticacion.js')


app.get('/imagen/:tipo/:img', verificaTokenFromUrl, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let tiposAceptados = ['productos', 'usuarios'];

    if (tiposAceptados.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo no permitida'
            }
        })
    }


    let pathImg = path.resolve(__dirname, `../..//uploads/${tipo}/${img}`);
    let pathNotFound = path.resolve(__dirname, '../assets/notFound.png');

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        res.sendFile(pathNotFound);
    }

});



module.exports = app;