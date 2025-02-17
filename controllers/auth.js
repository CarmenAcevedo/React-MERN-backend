const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const usuario = require('../models/usuario');

const crearUsuario = async(req, res = response ) => {

    // console.log('se requiere /');
    const { name, email, password } = req.body;

    //* Manejo de errores

    // if (name.length < 5 ) {
        // return res.status(400).json({
        //     ok: false,
        //     msg: 'El nombre debe de ser de 5 letras'
        // });
    // }  

    // console.log( errors );

    try {
        let usuario = await Usuario.findOne({ email });
        // console.log(usuario);
        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            })
        }

        usuario = new Usuario( req.body );

        //* Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );
          
        res.status(201).json({
            ok: true,
            msg: 'registro',
            uid: usuario.id,
            name: usuario.name,
            token
        })
    
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const loginUsuario = async(req, res) => {
    
    // console.log('se requiere /');
    const { email, password } = req.body;
    
    try {
        
        let usuario = await Usuario.findOne({ email });
        // console.log(usuario);
        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese correo'
            })
        }

        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar nuestro JWT
        const token = await generarJWT( usuario.id, usuario.name );

        return res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
    

    res.json({
        ok: true,
        msg: 'login',
        email,
        password
    })
}

const revalidarToken = async(req, res) => {

    // console.log('se requiere /');
    const { uid, name } = req;

    // Generar JWT
    const token = await generarJWT( uid, name );
    console.log(token);

    res.json({
        ok: true,
        // msg: 'renew'
        // uid, name,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}