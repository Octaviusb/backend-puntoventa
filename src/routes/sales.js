const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// Obtener todas las ventas
router.get('/', auth, salesController.getAllSales);

// Crear una nueva venta
router.post('/', [
    auth,
    check('productos', 'Los productos son obligatorios').isArray(),
    check('productos.*.producto', 'ID de producto inválido').isMongoId(),
    check('productos.*.cantidad', 'La cantidad debe ser un número mayor a 0').isInt({ min: 1 })
], salesController.createSale);

// Obtener una venta por ID
router.get('/:id', auth, salesController.getSaleById);

// Obtener ventas por fecha
router.get('/fecha/filtrar', auth, salesController.getSalesByDate);

// Obtener resumen de ventas
router.get('/resumen/dashboard', auth, salesController.getSalesSummary);

module.exports = router;