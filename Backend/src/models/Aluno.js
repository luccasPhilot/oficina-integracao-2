import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Aluno = sequelize.define('Aluno', {
  id: {
    type: DataTypes.STRING(8),
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  idade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  turma_id: {
    type: DataTypes.STRING(8),
    allowNull: false,
    references: {
      model: 'turmas',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'alunos',
  timestamps: true
});

export default Aluno;
