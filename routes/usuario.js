var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
//var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion')

var app = express();
var Usuario = require('../models/usuario');

//--------------------------------------------------------
//Obtener todos los usuarios
//--------------------------------------------------------
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Usuario.find({}, 'nombre apellidos email img rol google')
        .skip(desde)
        .limit(10)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mesanje: 'Error GET de usuarios!',
                        errors: err
                    });
                }
                Usuario.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        usuarios,
                        total: conteo
                    });
                });

            });
});
//--------------------------------------------------------
//obtener usuario
//--------------------------------------------------------
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Usuario.findById(id)
        .exec((err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al obtener usuario',
                    err
                });
            }
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe: id: ' + id,
                    erros: { message: 'Usuario no existe' }
                });
            }
            usuario.password = '123';
            res.status(200).json({
                ok: true,
                usuario
            });
        });

});
//--------------------------------------------------------
//Actualizar usuario
//--------------------------------------------------------

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mesanje: 'Error al buscar usario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mesanje: 'El usuario con el id' + id + ' no existe',
                errors: { message: 'No existe un usario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.apellidos = body.apellidos;
        usuario.email = body.email;
        usuario.password = bcrypt.hashSync(body.password);
        usuario.img = body.img;
        usuario.rol = body.rol;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mesanje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

//--------------------------------------------------------
//Crear un nuevo usuario
//--------------------------------------------------------

app.post('/', (req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        password: bcrypt.hashSync(body.password),
        rol: body.rol
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mesanje: 'Error al crear usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });
});

//--------------------------------------------------------
//Borrar un usuario por el id
//--------------------------------------------------------
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mesanje: 'Error al borrar usuario',
                errors: err
            });
        }
        if (!usarioBorrado) {
            return res.status(400).json({
                ok: false,
                mesanje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }
        usarioBorrado.password = ':)';
        res.status(200).json({
            ok: true,
            usuario: usarioBorrado
        });
    });
});

module.exports = app;