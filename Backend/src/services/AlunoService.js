import AlunoRepository from '../repositories/AlunoRepository.js';

const AlunoService = {
    createAluno: async (data) => {
        return await AlunoRepository.create(data);
    },

    getAlunoById: async (id) => {
        const turma = await AlunoRepository.findById(id);
        if (!turma) {
            throw new Error('Aluno não encontrado');
        }
        return turma;
    },

    getAllAlunos: async (search) => {
        return await AlunoRepository.findAll(search);
    },

    updateAluno: async (id, data) => {
        const turma = await AlunoRepository.findById(id);
        if (!turma) {
            throw new Error('Aluno não encontrado');
        }
        return await AlunoRepository.update(turma, data);
    },

    deleteAluno: async (id) => {
        const turma = await AlunoRepository.findById(id);
        if(!turma){
            throw new Error('Aluno não encontrado');
        }
        await AlunoRepository.remove(turma);
        return {message: 'Aluno removida com sucesso'};
    },
};

export default AlunoService;