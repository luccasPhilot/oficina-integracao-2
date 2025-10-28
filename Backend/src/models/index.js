import Escola from './Escola.js';
import Turma from './Turma.js';

Escola.hasMany(Turma, {
  foreignKey: 'escola_id',
  onDelete: 'CASCADE'
});

Turma.belongsTo(Escola, {
  foreignKey: 'escola_id'
});

export { Escola, Turma };
