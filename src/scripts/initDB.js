const mongoose = require('mongoose');
const User = require('../models/users');
require('dotenv').config();

// Función para inicializar la base de datos
const initDB = async () => {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a MongoDB');

        // Verificar si ya existe un usuario administrador
        const adminExists = await User.findOne({ email: 'admin@example.com' });
        
        if (adminExists) {
            console.log('El usuario administrador ya existe');
            await mongoose.connection.close();
            return;
        }

        // Crear usuario administrador
        const admin = new User({
            nombre: 'Administrador',
            email: 'admin@example.com',
            password: 'admin123',
            rol: 'admin'
        });

        await admin.save();
        console.log('Usuario administrador creado con éxito');
        
        // Cerrar la conexión
        await mongoose.connection.close();
        console.log('Conexión cerrada');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        process.exit(1);
    }
};

// Ejecutar la función
initDB();