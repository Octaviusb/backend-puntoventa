const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// Controlador (lo implementaremos más adelante)
const purchasesController = {
    getAllPurchases: (req, res) => {
        res.json({ message: 'Listado de compras' });
    },
    getPurchaseById: (req, res) => {
        res.json({ message: 'Detalle de compra' });
    },
    createPurchase: (req, res) => {
        res.json({ message: 'Compra registrada correctamente' });
    },
    updatePurchase: (req, res) => {
        res.json({ message: 'Compra actualizada correctamente' });
    },
    deletePurchase: (req, res) => {
        res.json({ message: 'Compra eliminada correctamente' });
    }
};

// Rutas para compras
router.get('/', auth, purchasesController.getAllPurchases);
router.get('/:id', auth, purchasesController.getPurchaseById);
router.post('/', [
    auth,
    check('supplier', 'El proveedor es obligatorio').not().isEmpty(),
    check('products', 'Los productos son obligatorios').isArray(),
    check('products.*.product', 'ID de producto inválido').isMongoId(),
    check('products.*.quantity', 'La cantidad debe ser un número mayor a 0').isInt({ min: 1 }),
    check('products.*.price', 'El precio debe ser un número mayor a 0').isNumeric()
], purchasesController.createPurchase);
router.put('/:id', auth, purchasesController.updatePurchase);
router.delete('/:id', auth, purchasesController.deletePurchase);

module.exports = router;