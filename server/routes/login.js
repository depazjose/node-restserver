const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_ID);

const Usuario = require('../models/usuario.js');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario o contraseña incorrectos.'
                    }
                });
            }
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos..'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB,
        }, process.env.JWT_SEED, { expiresIn: process.env.JWT_CADUCIDAD });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token
        })

    })


});


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    // console.log(payload.name);
    // console.log(payload.email);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


//verify().catch(console.error);



app.post('/google', async(req, res) => {
    console.log(req.body);
    let token = req.body.idToken;

    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err: err
            });
        });


    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe utilizar su autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB,
                }, process.env.JWT_SEED, { expiresIn: process.env.JWT_CADUCIDAD });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            //usuario no existe en bd

            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = "xdx";

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                let token = jwt.sign({
                    usuario: usuarioDB,
                }, process.env.JWT_SEED, { expiresIn: process.env.JWT_CADUCIDAD });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });


            })

        }



        // res.json({
        //     usuario: googleUser
        // });

    });







});




module.exports = app;