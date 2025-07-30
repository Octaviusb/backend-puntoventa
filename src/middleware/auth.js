// Try to import User model, but handle case where MongoDB is not connected
let User;
try {
    User = require('../models/users');
} catch (error) {
    console.log('No se pudo cargar el modelo de usuarios:', error.message);
    User = null;
}

const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    // Verificar si la ruta requiere autenticación
    const publicRoutes = [
        { path: '/api/users/login', method: 'POST' },
        { path: '/api/test', method: 'GET' },
        { path: '/', method: 'GET' }
    ];
    
    // Permitir rutas públicas sin token
    const isPublicRoute = publicRoutes.some(route => 
        route.path === req.path && route.method === req.method
    );
    
    if (isPublicRoute) {
        return next();
    }
    
    try {
        // Obtener el token del header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No hay token, autorización denegada' });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Si no hay conexión a MongoDB, permitir acceso con token válido
        if (User === null) {
            req.user = { id: decoded.id }; // Usuario simulado
            return next();
        }
        
        // Buscar el usuario
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ message: 'Token no válido' });
        }

        // Verificar si el usuario está activo
        if (!user.activo) {
            return res.status(401).json({ message: 'Usuario desactivado' });
        }

        // Añadir el usuario a la request
        req.user = user;
        next();
    } catch (error) {
        console.error('Error de autenticación:', error.message);
        // If MongoDB is not connected, still allow access with valid token
        if (error.name === 'MongoNetworkError' || error.name === 'MongooseServerSelectionError' || User === null) {
            // Try to decode token and allow access
            try {
                const token = req.header('Authorization')?.replace('Bearer ', '');
                if (!token) {
                    return res.status(401).json({ message: 'No hay token, autorización denegada' });
                }
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = { id: decoded.id }; // Usuario simulado
                return next();
            } catch (jwtError) {
                return res.status(401).json({ message: 'Token no válido' });
            }
        }
        res.status(401).json({ message: 'Token no válido' });
    }
};
