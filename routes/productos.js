const {Router} = require('express');
const {check} = require('express-validator');

const { validarJWT, validarCampos, esAdminRole} = require('../middlewares');

const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');

const { crearProducto, 
        obtenerProductos, 
        obtenerProducto, 
        actualizarProducto, 
        borrarProducto} = require('../controllers/productos');

const router = Router();

/**
 * {{url}}/api/productos
 */

// Obtener todas los productos - publico
router.get('/', obtenerProductos);

// Obtener un producto por id - publico
router.get('/:id', [    
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

// Crea producto - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

// Actualizar - privado - cualquier persona con token válido
router.put('/:id', [
    validarJWT,
    //check('categoria', 'No es un ID de Mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

// Borrar un producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);

module.exports = router;