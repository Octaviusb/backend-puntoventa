const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Crear un nuevo usuario
router.post('/register', async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, rol, activo) 
       VALUES ($1, $2, $3, $4, true) RETURNING *`,
      [nombre, email, password, rol]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// Actualizar un usuario (incluye activar/desactivar)
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { nombre, email, password, rol, activo } = req.body;
  try {
    const result = await pool.query(
      `UPDATE usuarios 
       SET nombre = $1, email = $2, password = $3, rol = $4, activo = $5 
       WHERE id = $6 RETURNING *`,
      [nombre, email, password || '123456', rol, activo, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

module.exports = router;
