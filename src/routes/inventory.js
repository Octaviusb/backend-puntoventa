const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// Obtener todos los productos del inventario
router.get('/', auth, inventoryController.getAllInventory);

// Agregar un nuevo producto al inventario
router.post('/', [
    auth,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoría es obligatoria').not().isEmpty(),
    check('cantidad', 'La cantidad debe ser un número mayor o igual a 0').isNumeric(),
    check('precio', 'El precio debe ser un número mayor a 0').isNumeric()
], inventoryController.createInventoryItem);

// Obtener un producto por ID
router.get('/:id', auth, inventoryController.getInventoryItemById);

// Actualizar un producto
router.put('/:id', [
    auth,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoría es obligatoria').not().isEmpty(),
    check('cantidad', 'La cantidad debe ser un número mayor o igual a 0').isNumeric(),
    check('precio', 'El precio debe ser un número mayor a 0').isNumeric()
], inventoryController.updateInventoryItem);

// Eliminar un producto
router.delete('/:id', auth, inventoryController.deleteInventoryItem);

module.exports = router;