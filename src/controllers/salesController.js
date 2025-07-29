// Datos simulados para demo
const ventasSimuladas = [
    {
        _id: '1',
        fecha: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
        cliente: { _id: '1', nombre: 'Cliente General' },
        productos: [
            { producto: { _id: '1', nombre: 'Smartphone XYZ', precio: 500 }, cantidad: 1, subtotal: 500 },
            { producto: { _id: '3', nombre: 'Auriculares Bluetooth', precio: 50 }, cantidad: 2, subtotal: 100 }
        ],
        total: 600,
        metodoPago: 'Efectivo',
        usuario: { _id: '1', nombre: 'Admin' }
    },
    {
        _id: '2',
        fecha: new Date(Date.now() - 1000 * 60 * 120), // 2 horas atrás
        cliente: { _id: '2', nombre: 'Juan Pérez' },
        productos: [
            { producto: { _id: '2', nombre: 'Laptop Pro', precio: 2000 }, cantidad: 1, subtotal: 2000 },
            { producto: { _id: '5', nombre: 'Teclado Mecánico', precio: 100 }, cantidad: 1, subtotal: 100 },
            { producto: { _id: '6', nombre: 'Mouse Inalámbrico', precio: 25 }, cantidad: 1, subtotal: 25 }
        ],
        total: 2125,
        metodoPago: 'Tarjeta',
        usuario: { _id: '1', nombre: 'Admin' }
    },
    {
        _id: '3',
        fecha: new Date(Date.now() - 1000 * 60 * 240), // 4 horas atrás
        cliente: { _id: '3', nombre: 'María González' },
        productos: [
            { producto: { _id: '4', nombre: 'Monitor 24"', precio: 300 }, cantidad: 2, subtotal: 600 },
            { producto: { _id: '8', nombre: 'Impresora Láser', precio: 450 }, cantidad: 1, subtotal: 450 }
        ],
        total: 1050,
        metodoPago: 'Efectivo',
        usuario: { _id: '1', nombre: 'Admin' }
    },
    {
        _id: '4',
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 día atrás
        cliente: { _id: '4', nombre: 'Carlos Rodríguez' },
        productos: [
            { producto: { _id: '9', nombre: 'Cámara DSLR', precio: 1200 }, cantidad: 1, subtotal: 1200 }
        ],
        total: 1200,
        metodoPago: 'Transferencia',
        usuario: { _id: '1', nombre: 'Admin' }
    },
    {
        _id: '5',
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 días atrás
        cliente: { _id: '5', nombre: 'Ana Martínez' },
        productos: [
            { producto: { _id: '7', nombre: 'Tablet 10"', precio: 350 }, cantidad: 1, subtotal: 350 },
            { producto: { _id: '10', nombre: 'Altavoz Bluetooth', precio: 80 }, cantidad: 2, subtotal: 160 }
        ],
        total: 510,
        metodoPago: 'Efectivo',
        usuario: { _id: '1', nombre: 'Admin' }
    }
];

// Controlador de ventas con datos simulados
const salesController = {
    // Obtener todas las ventas
    getAllSales: (req, res) => {
        res.json(ventasSimuladas);
    },

    // Obtener una venta por ID
    getSaleById: (req, res) => {
        const { id } = req.params;
        const venta = ventasSimuladas.find(v => v._id === id);
        
        if (!venta) {
            return res.status(404).json({ msg: 'Venta no encontrada' });
        }
        
        res.json(venta);
    },

    // Crear una nueva venta (simulado)
    createSale: (req, res) => {
        const { productos, cliente, metodoPago } = req.body;
        
        // Calculamos el total (simulado)
        const total = productos.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        
        // Simulamos la creación asignando un ID aleatorio
        const nuevaVenta = {
            _id: Math.floor(Math.random() * 1000).toString(),
            fecha: new Date(),
            cliente: cliente || { _id: '1', nombre: 'Cliente General' },
            productos: productos.map(p => ({
                producto: { _id: p.producto, nombre: `Producto ${p.producto}`, precio: p.precio || 0 },
                cantidad: p.cantidad,
                subtotal: (p.precio || 0) * p.cantidad
            })),
            total,
            metodoPago: metodoPago || 'Efectivo',
            usuario: { _id: '1', nombre: 'Admin' }
        };
        
        res.status(201).json({
            msg: 'Venta registrada correctamente',
            venta: nuevaVenta
        });
    },

    // Obtener ventas por fecha (simulado)
    getSalesByDate: (req, res) => {
        const { fechaInicio, fechaFin } = req.query;
        
        // Simulamos el filtrado por fecha
        res.json({
            msg: 'Ventas filtradas por fecha',
            fechaInicio,
            fechaFin,
            ventas: ventasSimuladas.slice(0, 3) // Devolvemos las primeras 3 ventas como ejemplo
        });
    },

    // Obtener resumen de ventas para el dashboard
    getSalesSummary: (req, res) => {
        res.json({
            today: { count: 12, total: 4850.75 },
            week: { count: 87, total: 32450.50 },
            month: { count: 342, total: 128750.25 },
            topProducts: [
                { nombre: 'Smartphone XYZ', cantidad: 42, total: 21000.00 },
                { nombre: 'Laptop Pro', cantidad: 18, total: 36000.00 },
                { nombre: 'Auriculares Bluetooth', cantidad: 65, total: 3250.00 }
            ]
        });
    }
};

module.exports = salesController;