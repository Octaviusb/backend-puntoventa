const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// Controlador (lo implementaremos más adelante)
const categoriesController = {
    getAllCategories: (req, res) => {
        res.json({ message: 'Listado de categorías' });
    },
    getCategoryById: (req, res) => {
        res.json({ message: 'Detalle de categoría' });
    },
    createCategory: (req, res) => {
        res.json({ message: 'Categoría creada correctamente' });
    },
    updateCategory: (req, res) => {
        res.json({ message: 'Categoría actualizada correctamente' });
    },
    deleteCategory: (req, res) => {
        res.json({ message: 'Categoría eliminada correctamente' });
    }
};

// Rutas para categorías
router.get('/', auth, categoriesController.getAllCategories);
router.get('/:id', auth, categoriesController.getCategoryById);
router.post('/', [
    auth,
    check('name', 'El nombre es obligatorio').not().isEmpty()
], categoriesController.createCategory);
router.put('/:id', [
    auth,
    check('name', 'El nombre es obligatorio').not().isEmpty()
], categoriesController.updateCategory);
router.delete('/:id', auth, categoriesController.deleteCategory);

module.exports = router;