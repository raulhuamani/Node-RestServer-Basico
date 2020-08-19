require('./config/config');

const express = require('express');
const mongoose = require('mongoose');


const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        // .then(() => console.log('Conectado a MongoDB...'))
        // .catch((error) => console.log('No se pudo conectar con MongoDB...'));
        if (err) throw err;
        console.log('Base de datos Online conectada');
    });
//mongoose.set('useCreateIndex', true);

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', 3000);
});