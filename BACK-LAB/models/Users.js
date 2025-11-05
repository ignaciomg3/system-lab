const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  usuario: {   
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  rol: {  
    type: String,
    required: true,
    enum: ['admin', 'usuario', 'tecnico', 'supervisor','analista'],
    default: 'usuario'
  },
  activo: {
    type: Boolean,
    default: true
  },
  fecha_creacion: { 
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false  // ← Eliminar __v
});

// Middleware para hashear la contraseña antes de guardar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
UserSchema.methods.compararPassword = async function(passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

// Método para obtener perfil público (sin contraseña)
UserSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('Users', UserSchema, 'users');