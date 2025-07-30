const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Ruta: GET /api/dashboard/summary
router.get('/summary', async (req, res) => {
  try {
    const ventasHoyQuery = `
      SELECT COUNT(*) AS count, COALESCE(SUM(total), 0) AS total
      FROM ventas
      WHERE DATE(fecha) = CURRENT_DATE
    `;
    const ventasMesQuery = `
      SELECT COUNT(*) AS count, COALESCE(SUM(total), 0) AS total
      FROM ventas
      WHERE DATE_TRUNC('month', fecha) = DATE_TRUNC('month', CURRENT_DATE)
    `;

    const inventarioQuery = `
      SELECT COUNT(*) AS totalProducts,
             COUNT(*) FILTER (WHERE stock <= minimo) AS lowStock
      FROM productos
    `;

    const cajaQuery = `
      SELECT 
        SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) AS income,
        SUM(CASE WHEN tipo = 'egreso' THEN monto ELSE 0 END) AS expense,
        SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE -monto END) AS currentBalance
      FROM movimientos_caja
      WHERE DATE(fecha) = CURRENT_DATE
    `;

    const actividadQuery = `
      SELECT descripcion
      FROM actividad_reciente
      ORDER BY fecha DESC
      LIMIT 5
    `;

    const [ventasHoy, ventasMes, inventario, caja, actividad] = await Promise.all([
      pool.query(ventasHoyQuery),
      pool.query(ventasMesQuery),
      pool.query(inventarioQuery),
      pool.query(cajaQuery),
      pool.query(actividadQuery)
    ]);

    res.json({
      data: {
        salesSummary: {
          today: ventasHoy.rows[0],
          month: ventasMes.rows[0]
        },
        inventory: inventario.rows[0],
        cashRegister: {
          currentBalance: caja.rows[0]?.currentbalance || 0,
          todayMovements: {
            income: caja.rows[0]?.income || 0,
            expense: caja.rows[0]?.expense || 0
          }
        },
        recentActivity: actividad.rows.map(row => row.descripcion)
      }
    });
  } catch (error) {
    console.error('Error al obtener resumen del dashboard:', error);
    res.status(500).json({ error: 'Error al obtener los datos del dashboard' });
  }
});

module.exports = router;
