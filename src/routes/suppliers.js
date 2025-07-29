const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// Controlador (lo implementaremos más adelante)
const suppliersController = {
    getAllSuppliers: (req, res) => {
        res.json({ message: 'Listado de proveedores' });
    },
    getSupplierById: (req, res) => {
        res.json({ message: 'Detalle de proveedor' });
    },
    createSupplier: (req, res) => {
        res.json({ message: 'Proveedor creado correctamente' });
    },
    updateSupplier: (req, res) => {
        res.json({ message: 'Proveedor actualizado correctamente' });
    },
    deleteSupplier: (req, res) => {
        res.json({ message: 'Proveedor eliminado correctamente' });
    }
};

// Rutas para proveedores
router.get('/', auth, suppliersController.getAllSuppliers);
router.get('/:id', auth, suppliersController.getSupplierById);
router.post('/', [
    auth,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('contact', 'El contacto es obligatorio').not().isEmpty()
], suppliersController.createSupplier);
router.put('/:id', [
    auth,
    check('name', 'El nombre es obligatorio').not().isEmpty()
], suppliersController.updateSupplier);
router.delete('/:id', auth, suppliersController.deleteSupplier);

module.exports = router;