const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Ruta: GET /api/dashboard/summary
router.get('/summary', async (req, res) => {
  try {
    const ventasHoyQuery = `
      SELECT COUNT(*) AS cantidad, COALESCE(SUM(total), 0) AS total
      FROM ventas
      WHERE DATE(fecha) = CURRENT_DATE
    `;
    const ventasMesQuery = `
      SELECT COUNT(*) AS cantidad, COALESCE(SUM(total), 0) AS total
      FROM ventas
      WHERE DATE_TRUNC('month', fecha) = DATE_TRUNC('month', CURRENT_DATE)
    `;

    const [ventasHoy, ventasMes] = await Promise.all([
      pool.query(ventasHoyQuery),
      pool.query(ventasMesQuery),
    ]);

    res.json({
      ventasHoy: ventasHoy.rows[0],
      ventasMes: ventasMes.rows[0],
    });
  } catch (error) {
    console.error('Error al obtener resumen del dashboard:', error);
    res.status(500).json({ error: 'Error al obtener los datos del dashboard' });
  }
});

module.exports = router;
