import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Turma = sequelize.define('Turma', {
  id: {
    type: DataTypes.STRING(8),
    primaryKey: true
  },
  identificacao: {
    type: DataTypes.STRING(100),
    allowNull: false
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
  tableName: 'turmas',
  timestamps: true
});

export default Turma;
