// Datos simulados para demo
const inventarioSimulado = [
    { _id: '1', codigo: 'P001', nombre: 'Smartphone XYZ', categoria: 'Electrónica', cantidad: 15, precio: 500.00 },
    { _id: '2', codigo: 'P002', nombre: 'Laptop Pro', categoria: 'Computación', cantidad: 8, precio: 2000.00 },
    { _id: '3', codigo: 'P003', nombre: 'Auriculares Bluetooth', categoria: 'Accesorios', cantidad: 25, precio: 50.00 },
    { _id: '4', codigo: 'P004', nombre: 'Monitor 24"', categoria: 'Computación', cantidad: 12, precio: 300.00 },
    { _id: '5', codigo: 'P005', nombre: 'Teclado Mecánico', categoria: 'Accesorios', cantidad: 18, precio: 100.00 },
    { _id: '6', codigo: 'P006', nombre: 'Mouse Inalámbrico', categoria: 'Accesorios', cantidad: 30, precio: 25.00 },
    { _id: '7', codigo: 'P007', nombre: 'Tablet 10"', categoria: 'Electrónica', cantidad: 10, precio: 350.00 },
    { _id: '8', codigo: 'P008', nombre: 'Impresora Láser', categoria: 'Oficina', cantidad: 5, precio: 450.00 },
    { _id: '9', codigo: 'P009', nombre: 'Cámara DSLR', categoria: 'Fotografía', cantidad: 7, precio: 1200.00 },
    { _id: '10', codigo: 'P010', nombre: 'Altavoz Bluetooth', categoria: 'Audio', cantidad: 22, precio: 80.00 }
];

// Controlador de inventario con datos simulados
const inventoryController = {
    // Obtener todos los productos
    getAllInventory: (req, res) => {
        res.json(inventarioSimulado);
    },

    // Obtener un producto por ID
    getInventoryItemById: (req, res) => {
        const { id } = req.params;
        const producto = inventarioSimulado.find(p => p._id === id);
        
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        
        res.json(producto);
    },

    // Crear un nuevo producto (simulado)
    createInventoryItem: (req, res) => {
        const { nombre, categoria, cantidad, precio, codigo } = req.body;
        
        // Simulamos la creación asignando un ID aleatorio
        const nuevoProducto = {
            _id: Math.floor(Math.random() * 1000).toString(),
            codigo: codigo || `P${Math.floor(Math.random() * 1000)}`,
            nombre,
            categoria,
            cantidad,
            precio
        };
        
        res.status(201).json({
            msg: 'Producto creado correctamente',
            producto: nuevoProducto
        });
    },

    // Actualizar un producto (simulado)
    updateInventoryItem: (req, res) => {
        const { id } = req.params;
        const { nombre, categoria, cantidad, precio, codigo } = req.body;
        
        const producto = inventarioSimulado.find(p => p._id === id);
        
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        
        // Simulamos la actualización
        const productoActualizado = {
            ...producto,
            nombre: nombre || producto.nombre,
            categoria: categoria || producto.categoria,
            cantidad: cantidad !== undefined ? cantidad : producto.cantidad,
            precio: precio !== undefined ? precio : producto.precio,
            codigo: codigo || producto.codigo
        };
        
        res.json({
            msg: 'Producto actualizado correctamente',
            producto: productoActualizado
        });
    },

    // Eliminar un producto (simulado)
    deleteInventoryItem: (req, res) => {
        const { id } = req.params;
        
        const producto = inventarioSimulado.find(p => p._id === id);
        
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        
        res.json({ msg: 'Producto eliminado correctamente' });
    }
};

module.exports = inventoryController;