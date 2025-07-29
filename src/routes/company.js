const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// Controlador (lo implementaremos más adelante)
const companyController = {
    getCompanyInfo: (req, res) => {
        res.json({ message: 'Información de la empresa' });
    },
    updateCompanyInfo: (req, res) => {
        res.json({ message: 'Información de la empresa actualizada correctamente' });
    },
    uploadLogo: (req, res) => {
        res.json({ message: 'Logo subido correctamente' });
    }
};

// Rutas para la información de la empresa
router.get('/', auth, companyController.getCompanyInfo);
router.put('/', [
    auth,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('address', 'La dirección es obligatoria').not().isEmpty(),
    check('phone', 'El teléfono es obligatorio').not().isEmpty(),
    check('taxId', 'El ID fiscal es obligatorio').not().isEmpty()
], companyController.updateCompanyInfo);
router.post('/logo', auth, companyController.uploadLogo);

module.exports = router;