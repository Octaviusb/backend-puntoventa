const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// Controlador (lo implementaremos más adelante)
const clientsController = {
    getAllClients: (req, res) => {
        res.json({ message: 'Listado de clientes' });
    },
    getClientById: (req, res) => {
        res.json({ message: 'Detalle de cliente' });
    },
    createClient: (req, res) => {
        res.json({ message: 'Cliente creado correctamente' });
    },
    updateClient: (req, res) => {
        res.json({ message: 'Cliente actualizado correctamente' });
    },
    deleteClient: (req, res) => {
        res.json({ message: 'Cliente eliminado correctamente' });
    }
};

// Rutas para clientes
router.get('/', auth, clientsController.getAllClients);
router.get('/:id', auth, clientsController.getClientById);
router.post('/', [
    auth,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('document', 'El documento es obligatorio').not().isEmpty()
], clientsController.createClient);
router.put('/:id', [
    auth,
    check('name', 'El nombre es obligatorio').not().isEmpty()
], clientsController.updateClient);
router.delete('/:id', auth, clientsController.deleteClient);

module.exports = router;