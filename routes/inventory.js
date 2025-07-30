const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET /api/inventory
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

module.exports = router;
