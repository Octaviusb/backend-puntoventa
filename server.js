const express = require('express');
const cors = require('cors');
const pool = require('./config/database');
require('dotenv').config();
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta para probar conexión con la base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    res.json({ success: true, time: rows[0].now });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ruta principal
app.get('/', (req, res) => {
  res.send('API punto de venta funcionando correctamente.');
});

// Inicio del servidor
app.listen(PORT, () => {
  const environment = process.env.NODE_ENV || 'desarrollo';
  console.log(`✅ Servidor backend activo en modo "${environment}" en el puerto ${PORT}`);
});

// Rutas de usuarios
app.use('/api/users', userRoutes);

