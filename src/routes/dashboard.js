const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Controlador con datos simulados para demo
const dashboardController = {
    getSummary: (req, res) => {
        // Simular un retraso para que parezca una llamada real a la base de datos
        setTimeout(() => {
            res.json({
                message: 'Resumen del dashboard',
                data: {
                    salesSummary: {
                        today: { count: 12, total: 4850.75 },
                        week: { count: 87, total: 32450.50 },
                        month: { count: 342, total: 128750.25 }
                    },
                    inventory: {
                        totalProducts: 248,
                        lowStock: 15,
                        categories: 8
                    },
                    cashRegister: {
                        currentBalance: 5280.50,
                        todayMovements: { income: 4850.75, expense: 1200.00 }
                    },
                    recentActivity: [
                        "Venta #1089 registrada por $450.75 - hace 5 minutos",
                        "Producto 'Smartphone XYZ' actualizado - hace 15 minutos",
                        "Compra a proveedor 'Distribuidora ABC' por $1200.00 - hace 1 hora",
                        "Usuario 'Vendedor1' inició sesión - hace 2 horas",
                        "Cierre de caja con balance $3250.25 - ayer"
                    ]
                }
            });
        }, 100); // 100ms de retraso simulado
    },
    getTopProducts: (req, res) => {
        // Simular un retraso para que parezca una llamada real a la base de datos
        setTimeout(() => {
            res.json({ 
                message: 'Productos más vendidos',
                data: [
                    { nombre: 'Smartphone XYZ', cantidad: 42, total: 21000.00 },
                    { nombre: 'Laptop Pro', cantidad: 18, total: 36000.00 },
                    { nombre: 'Auriculares Bluetooth', cantidad: 65, total: 3250.00 },
                    { nombre: 'Monitor 24"', cantidad: 24, total: 7200.00 },
                    { nombre: 'Teclado Mecánico', cantidad: 30, total: 3000.00 }
                ]
            });
        }, 100); // 100ms de retraso simulado
    },
    getSalesByPeriod: (req, res) => {
        // Simular un retraso para que parezca una llamada real a la base de datos
        setTimeout(() => {
            res.json({ 
                message: 'Ventas por período',
                data: {
                    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
                    datasets: [
                        {
                            label: 'Ventas diarias',
                            data: [4500, 3800, 5200, 4900, 6100, 8500, 5800]
                        }
                    ]
                }
            });
        }, 100); // 100ms de retraso simulado
    }
};

// Rutas para el dashboard
router.get('/summary', auth, dashboardController.getSummary);
router.get('/top-products', auth, dashboardController.getTopProducts);
router.get('/sales-by-period', auth, dashboardController.getSalesByPeriod);

module.exports = router;
