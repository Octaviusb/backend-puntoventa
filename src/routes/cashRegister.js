const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// Controlador (lo implementaremos más adelante)
const cashRegisterController = {
    openCashRegister: (req, res) => {
        res.json({ message: 'Caja abierta correctamente' });
    },
    closeCashRegister: (req, res) => {
        res.json({ message: 'Caja cerrada correctamente' });
    },
    getCashMovements: (req, res) => {
        res.json({ message: 'Movimientos de caja obtenidos' });
    },
    addCashMovement: (req, res) => {
        res.json({ message: 'Movimiento de caja registrado' });
    }
};

// Rutas para la caja
router.post('/open', auth, cashRegisterController.openCashRegister);
router.post('/close', auth, cashRegisterController.closeCashRegister);
router.get('/movements', auth, cashRegisterController.getCashMovements);
router.post('/movements', [
    auth,
    check('amount', 'El monto es obligatorio').isNumeric(),
    check('type', 'El tipo de movimiento es obligatorio').isIn(['income', 'expense']),
    check('description', 'La descripción es obligatoria').not().isEmpty()
], cashRegisterController.addCashMovement);

module.exports = router;