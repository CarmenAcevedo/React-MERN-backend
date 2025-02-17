/*
    Event Routes
    /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require("../middlewares/validar-jwt");
const { getEventos, eliminarEvento, actualizarEvento, crearEvento } = require("../controllers/events");
const { isDate } = require('../helpers/isDate');

const router = Router();

//* Todos tienen que pasar por la validacion de JWT
router.use( validarJWT );

// Obtener eventos
router.get( '/', getEventos );

// Crear un nuevo evento
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de ínicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalizacion es obligatoria').custom( isDate ),
        validarCampos
    ],
    crearEvento );

// Actualizar evento
router.put(
    '/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de ínicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalizacion es obligatoria').custom( isDate ),
        validarCampos
    ],
    actualizarEvento );

// Borrar  evento
router.delete('/:id', eliminarEvento );

module.exports = router;