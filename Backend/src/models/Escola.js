import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Escola = sequelize.define('Escola', {
  id: {
    type: DataTypes.STRING(8),
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  endereco: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cidade: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(2),
    allowNull: true
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true
    }
  }
}, {
  tableName: 'escolas',
  timestamps: true
});

export default Escola;
