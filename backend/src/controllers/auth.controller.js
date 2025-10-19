const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Profesional = require('../models/Profesional');

const generateToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id_usuario, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const usuario = await Usuario.findByEmail(email);
    
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const isPasswordValid = await Usuario.comparePassword(password, usuario.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const token = generateToken(usuario);
    
    // Si es profesional, obtener datos adicionales
    let profesionalData = null;
    if (usuario.rol === 'profesional') {
      profesionalData = await Profesional.findByUsuarioId(usuario.id_usuario);
    }
    
    res.json({
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        profesional: profesionalData
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol, especialidad } = req.body;
    
    const existingUser = await Usuario.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    const usuario = await Usuario.create({ nombre, email, password, rol });
    
    // Si es profesional, crear registro en tabla Profesional
    if (rol === 'profesional' && especialidad) {
      await Profesional.create({
        id_usuario: usuario.id_usuario,
        especialidad
      });
    }
    
    const token = generateToken(usuario);
    
    res.status(201).json({
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id_usuario);
    
    let profesionalData = null;
    if (usuario.rol === 'profesional') {
      profesionalData = await Profesional.findByUsuarioId(usuario.id_usuario);
    }
    
    res.json({
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        created_at: usuario.created_at,
        profesional: profesionalData
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { nombre, email } = req.body;
    
    const usuario = await Usuario.update(req.usuario.id_usuario, { 
      nombre, 
      email, 
      rol: req.usuario.rol 
    });
    
    res.json({ usuario });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const usuario = await Usuario.findByEmail(req.usuario.email);
    const isPasswordValid = await Usuario.comparePassword(currentPassword, usuario.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Contraseña actual incorrecta' });
    }
    
    await Usuario.updatePassword(req.usuario.id_usuario, newPassword);
    
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
};
