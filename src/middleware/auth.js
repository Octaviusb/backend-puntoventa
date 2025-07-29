const jwt = require('jsonwebtoken');
const User = require('../models/users');

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
        res.status(401).json({ message: 'Token no válido' });
    }
};