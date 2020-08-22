require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// app.use(require('./routes/usuario'));
// app.use(require('./routes/login'));

// Configuracion global de rutas - reemplaza lo de arriba
app.use(require('./routes/index'));


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        // .then(() => console.log('Conectado a MongoDB...'))
        // .catch((error) => console.log('No se pudo conectar con MongoDB...'));
        if (err) throw err;
        console.log('Base de datos Online conectada');
    });
//mongoose.set('useCreateIndex', true);

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
});