const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Ruta: GET /api/productos
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener productos', err);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
