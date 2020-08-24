const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


const fs = require('fs'); // para validar archivo existe
const path = require('path'); // para las rutas

// default options
app.use(fileUpload()); // Todos los archivos que se carguen por default van en req.files

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    }

    // Valida tipo
    let tiposValidos = ['productos', 'usuarios']; // Carpetas dentro de uploads
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Los tipos permitidos son: ' + tiposValidos.join(', ')
                }
            })
    }

    let archivo = req.files.archivo;
    let nombreSeparado = archivo.name.split('.'); // ['nombreArchivo', 'jpeg'] 
    // capturamos ultimo posicion del arreglo nombreSeparado --> 'jpeg'
    let extension = nombreSeparado[nombreSeparado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', '),
                    ext: extension
                }
            })
    }

    // Cambia nombre al archivo
    let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err)
            return res.status(500)
                .json({
                    ok: false,
                    err
                });

        // Aqui, imagen cargada
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }


    });

});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo('usuarios', nombreArchivo);

            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }

        if (!usuarioDB) {
            borraArchivo('usuarios', nombreArchivo);

            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'Usuario no existe'
                    }
                });
        }

        borraArchivo('usuarios', usuarioDB.img);

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });
    });
}



function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo('productos', nombreArchivo);

            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }

        if (!productoDB) {
            borraArchivo('productos', nombreArchivo);

            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'Producto no existe'
                    }
                });
        }

        borraArchivo('productos', productoDB.img);

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });
    });
}

function borraArchivo(tipo, nombreArchivo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`)
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;