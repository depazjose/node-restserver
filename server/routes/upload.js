const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario.js');

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

        userImage(id, res, fileNameToPersist);

        res.json({
            ok: true,
            message: 'File uploaded!'
        });
    });
});

function userImage(id, res, nombreArchivo) {
    Usuario.findById(id, (err, userDb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

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

module.exports = app;