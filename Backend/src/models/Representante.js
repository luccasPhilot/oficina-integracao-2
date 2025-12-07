import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Representante = sequelize.define('Representante', {
  id: {
    type: DataTypes.STRING(8),
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  cargo: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  escola_id: {
    type: DataTypes.STRING(8),
    allowNull: false,
    references: {
      model: 'escolas',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'representantes',
  timestamps: true
});

export default Representante;
