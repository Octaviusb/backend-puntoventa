const User = require('../models/users');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generar JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secretkey', {
        expiresIn: '24h'
    });
};

// Registrar un nuevo usuario
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Si no hay conexión a MongoDB, devolver un mensaje de error
    if (typeof User === 'undefined' || User === null) {
        return res.status(500).json({ message: 'Servicio no disponible: Error de conexión a la base de datos' });
    }

    try {
        const { nombre, email, password, rol } = req.body;

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Crear nuevo usuario
        const user = new User({
            nombre,
            email,
            password,
            rol
        });

        await user.save();

        res.status(201).json({
            _id: user._id,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
};

// Login de usuario
exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Si no hay conexión a MongoDB, permitir login con credenciales por defecto
    if (typeof User === 'undefined' || User === null) {
        const { email, password } = req.body;
        // Credenciales por defecto para demo
        if (email === 'admin@admin.com' && password === 'admin123') {
            return res.json({
                _id: 'demo-user-id',
                nombre: 'Usuario Demo',
                email: 'admin@admin.com',
                rol: 'admin',
                token: generateToken('demo-user-id')
            });
        }
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verificar si la contraseña es correcta
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verificar si el usuario está activo
        if (!user.activo) {
            return res.status(401).json({ message: 'Usuario desactivado' });
        }

        res.json({
            _id: user._id,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    // Si no hay conexión a MongoDB, devolver usuarios simulados
    if (typeof User === 'undefined' || User === null) {
        return res.json([{
            _id: 'demo-user-id',
            nombre: 'Usuario Demo',
            email: 'admin@admin.com',
            rol: 'admin',
            activo: true
        }]);
    }

    try {
        const usuarios = await User.find().select('-password');
        res.json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
    // Si no hay conexión a MongoDB, devolver usuario simulado
    if (typeof User === 'undefined' || User === null) {
        return res.json({
            _id: 'demo-user-id',
            nombre: 'Usuario Demo',
            email: 'admin@admin.com',
            rol: 'admin',
            activo: true
        });
    }

    try {
        const usuario = await User.findById(req.params.id).select('-password');
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Si no hay conexión a MongoDB, devolver un mensaje de error
    if (typeof User === 'undefined' || User === null) {
        return res.status(500).json({ message: 'Servicio no disponible: Error de conexión a la base de datos' });
    }

    try {
        const { nombre, email, rol, activo } = req.body;

        // Verificar si el email ya existe en otro usuario
        if (email) {
            const existingUser = await User.findOne({ 
                email, 
                _id: { $ne: req.params.id } 
            });
            if (existingUser) {
                return res.status(400).json({ message: 'El email ya está en uso' });
            }
        }

        const updateData = { nombre, email, rol, activo };
        
        // Si se proporciona una nueva contraseña, actualizarla
        if (req.body.password) {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            user.password = req.body.password;
            await user.save();
        }

        const usuario = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-password');

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
    // Si no hay conexión a MongoDB, devolver un mensaje de error
    if (typeof User === 'undefined' || User === null) {
        return res.status(500).json({ message: 'Servicio no disponible: Error de conexión a la base de datos' });
    }

    try {
        const usuario = await User.findByIdAndDelete(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};
