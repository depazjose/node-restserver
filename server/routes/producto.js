const express = require('express');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion.js');

let app = express();

let Producto = require('../models/producto.js')

// Mostrar todos los productos
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 10;

    desde = Number(desde);
    limite = Number(limite);

    Producto.find({ disponible: true })
        .sort('descripcion')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos,
                cuantos: productos.length
            });

        });

});


app.get('/producto/buscar/:termino', verificaToken, (req, res) => {


    let termino = req.params.termino;
    let reg = new RegExp(termino, 'i');


    Producto.find({ nombre: reg, disponible: true })
        .sort('descripcion')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos,
                cuantos: productos.length
            });

        });

});

// Mostrar una Producto por ID
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;


    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });

});

// Crear una Producto
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });


    });

});

// Actualizar una Producto
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save((err, productoSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(204).json({
                    ok: false,
                    err
                });
            }

            res.status(200).json({
                ok: true,
                producto: productoSaved
            });

        });

    });

});


// Eliminarr una Producto
app.delete('/producto/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;


    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        productoDB.disponible = false;


        productoDB.save((err, productoSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(204).json({
                    ok: false,
                    err
                });
            }

            res.status(200).json({
                ok: true,
                producto: productoSaved
            });

        });

    });

});


module.exports = app;