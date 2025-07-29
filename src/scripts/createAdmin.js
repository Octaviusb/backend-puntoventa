const mongoose = require('mongoose');
const User = require('../models/users');
require('dotenv').config();

// Función para crear un usuario administrador simple
const createAdmin = async () => {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a MongoDB');

        // Crear usuario administrador con email simple
        const admin = new User({
            nombre: 'Admin',
            email: 'admin@admin.com',
            password: 'admin123',
            rol: 'admin'
        });

        await admin.save();
        console.log('Usuario administrador creado con éxito');
        console.log('Email: admin@admin.com');
        console.log('Contraseña: admin123');
        
        // Cerrar la conexión
        await mongoose.connection.close();
        console.log('Conexión cerrada');
    } catch (error) {
        console.error('Error al crear el usuario administrador:', error);
        process.exit(1);
    }
};

// Ejecutar la función
createAdmin();