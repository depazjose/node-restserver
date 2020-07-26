const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario.js');
const Producto = require('../models/producto.js');
const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: 'No files were uploaded.'
            });
    }

    let tiposAceptados = ['productos', 'usuarios'];

    if (tiposAceptados.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo no permitida'
            }
        })
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let archivoMetadata = archivo.name.split('.');
    let archivoExtension = archivoMetadata[archivoMetadata.length - 1];
    let extensiones = ['jpg', 'jpeg', 'png', 'gif'];

    if (extensiones.indexOf(archivoExtension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extension de archivo no permitida'
            }
        })
    }

    let fileNameToPersist = `${id}-${new Date().getTime()}.${archivoExtension}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${fileNameToPersist}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        switch (tipo) {
            case 'usuarios':
                {
                    userImage(id, res, fileNameToPersist);
                    break;
                }
            case 'productos':
                {
                    imagenProducto(id, res, fileNameToPersist);
                    break;
                }

        }



    });
});

function userImage(id, res, nombreArchivo) {
    Usuario.findById(id, (err, userDb) => {

        if (err) {
            borraArchivo('usuarios', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDb) {
            borraArchivo('usuarios', nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        borraArchivo('usuarios', userDb.img);

        userDb.img = nombreArchivo;


        userDb.save((err, userSaved) => {
            res.json({
                ok: true,
                usuario: userSaved,
                img: nombreArchivo
            })
        });


    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDb) => {

        if (err) {
            borraArchivo('productos', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDb) {
            borraArchivo('productos', nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            });
        }

        borraArchivo('productos', productoDb.img);

        productoDb.img = nombreArchivo;


        productoDb.save((err, productSaved) => {
            res.json({
                ok: true,
                producto: productSaved,
                img: nombreArchivo
            })
        });


    });
}

function borraArchivo(tipo, imageToDelete) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${imageToDelete}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}


module.exports = app;