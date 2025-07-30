const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet'); // Seguridad HTTP
const rateLimit = require('express-rate-limit'); // Limitar solicitudes
const mongoSanitize = require('express-mongo-sanitize'); // Prevenir inyección NoSQL
require('dotenv').config();

// Import routes
const salesRoutes = require('./routes/sales');
const inventoryRoutes = require('./routes/inventory');
const userRoutes = require('./src/routes/users');
const cashRegisterRoutes = require('./src/routes/cashRegister');
const purchasesRoutes = require('./src/routes/purchases');
const categoriesRoutes = require('./src/routes/categories');
const clientsRoutes = require('./src/routes/clients');
const suppliersRoutes = require('./src/routes/suppliers');
const companyRoutes = require('./src/routes/company');
const dashboardRoutes = require('./src/routes/dashboard');

const app = express();
const PORT = process.env.PORT || 7000;

// Configurar variables de entorno
if (!process.env.JWT_SECRET) {
    // Generar una clave secreta aleatoria si no existe
    const crypto = require('crypto');
    process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex');
    console.warn('ADVERTENCIA: JWT_SECRET no está definido en el archivo .env. Se ha generado una clave aleatoria temporal.');
}

// Conexión a MongoDB con manejo de errores mejorado
let mongoConnected = false;

// Only try to connect to MongoDB if MONGODB_URI is defined
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Conectado a MongoDB');
        mongoConnected = true;
    })
    .catch(err => {
        console.error('Error al conectar a MongoDB:', err);
        console.log('Continuando sin conexión a MongoDB. Algunas funciones pueden no estar disponibles.');
        mongoConnected = false;
    });
} else {
    console.log('MONGODB_URI no está definido. Continuando sin conexión a MongoDB.');
    mongoConnected = false;
}

// Middleware para verificar conexión a MongoDB
const checkMongoDB = (req, res, next) => {
    // Allow dashboard routes to proceed even without MongoDB connection
    // The dashboard controller already handles MongoDB unavailability
    if (!mongoConnected && req.path.includes('/users')) {
        return res.status(500).json({ 
            message: 'Servicio temporalmente no disponible: Error de conexión a la base de datos' 
        });
    }
    next();
};

// Aplicar middleware de verificación de MongoDB
app.use(checkMongoDB);

// Middleware - IMPORTANTE: CORS debe ir antes de definir rutas

// Configuración CORS más segura y optimizada
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://puntode-venta-six.vercel.app'] // En producción, limitar a dominios específicos
        : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://127.0.0.1:3000'], // En desarrollo
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24 horas
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Middleware para manejar OPTIONS preflight
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
            ? 'https://puntode-venta-six.vercel.app' 
            : 'http://localhost:3000');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');
        return res.status(200).end();
    }
    next();
});

// Middleware de seguridad
app.use(helmet()); // Cabeceras HTTP seguras

// Limitar solicitudes para prevenir ataques de fuerza bruta
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 solicitudes por ventana
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo después de 15 minutos'
});

// Aplicar limitador a todas las rutas de autenticación
app.use('/api/users/login', limiter);

// Prevenir inyección NoSQL
app.use(mongoSanitize());

// Prevenir ataques de Pollution de Parámetros
app.use(bodyParser.json({ limit: '10kb' })); // Limitar tamaño del body
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));

// Servir favicon correctamente
app.use('/favicon.ico', express.static(path.join(__dirname, 'favicon.ico')));

app.get('/', (req, res) => {
    res.send('API Punto de Venta funcionando');
});

// Endpoint de prueba
app.get('/api/test', (req, res) => {
    res.json({ message: 'Conexión exitosa con el backend', timestamp: new Date() });
});

// Test route to check MongoDB connection status
app.get('/api/test-db-status', (req, res) => {
    res.json({ 
        mongoConnected: mongoConnected,
        message: mongoConnected ? 'Conectado a MongoDB' : 'No conectado a MongoDB'
    });
});

// Middleware de autenticación global
const auth = require('./middleware/auth');

// Aplicar autenticación solo a rutas específicas (no a login ni test)
app.use('/api/sales', auth);
app.use('/api/inventory', auth);
app.use('/api/cash-register', auth);
app.use('/api/purchases', auth);
app.use('/api/categories', auth);
app.use('/api/clients', auth);
app.use('/api/suppliers', auth);
app.use('/api/company', auth);
app.use('/api/dashboard', auth);
app.use('/api/users/profile', auth);

// Routes - Colocadas después de la configuración de autenticación
app.use('/api/users', userRoutes); // Esta ruta incluye login que no requiere autenticación
app.use('/api/sales', salesRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/cash-register', cashRegisterRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

