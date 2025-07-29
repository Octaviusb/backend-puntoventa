// backend/routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/database');

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Aquí puedes agregar generación de token JWT si lo necesitas
    return res.json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    });

  } catch (err) {
    console.error('Error en login:', err.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
