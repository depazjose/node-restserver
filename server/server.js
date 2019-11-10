require('./config/config.js');
const express = require('express');
const mongoose = require('mongoose');


const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(require('./routes/usuario.js'));

app.get('/', function(req, res) {
    //res.send('Hello World')
    res.json('Hello World')
});

mongoose.connect(process.env.URL_DATABASE, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err) => {

        if (err) throw err;
        console.log('Base de datos UP');
    });

app.listen(process.env.PORT, () => {
    console.log("Escuchando en: ", process.env.PORT);
});