import Escola from './Escola.js';
import Turma from './Turma.js';
import Aluno from './Aluno.js';
import Representante from './Representante.js';

Escola.hasMany(Turma, {
  foreignKey: 'escola_id',
  onDelete: 'CASCADE'
});

Turma.belongsTo(Escola, {
  foreignKey: 'escola_id'
});

Turma.hasMany(Aluno, {
  foreignKey: 'turma_id',
  onDelete: 'CASCADE'
});

Aluno.belongsTo(Turma, {
  foreignKey: 'turma_id'
});

Escola.hasMany(Representante, {
  foreignKey: 'escola_id',
  onDelete: 'CASCADE'
});

Representante.belongsTo(Escola, {
  foreignKey: 'escola_id',
});

export { Escola, Turma, Aluno, Representante };
