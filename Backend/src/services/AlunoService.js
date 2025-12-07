import AlunoRepository from '../repositories/AlunoRepository.js';

const AlunoService = {
    createAluno: async (data) => {
        return await AlunoRepository.create(data);
    },

    getAlunoById: async (id) => {
        const aluno = await AlunoRepository.findById(id);
        if (!aluno) {
            throw new Error('Aluno não encontrado');
        }
        return aluno;
    },

    getAllAlunos: async (search) => {
        return await AlunoRepository.findAll(search);
    },

    updateAluno: async (id, data) => {
        const aluno = await AlunoRepository.findById(id);
        if (!aluno) {
            throw new Error('Aluno não encontrado');
        }
        return await AlunoRepository.update(aluno, data);
    },

    deleteAluno: async (id) => {
        const aluno = await AlunoRepository.findById(id);
        if(!aluno){
            throw new Error('Aluno não encontrado');
        }
        await AlunoRepository.remove(aluno);
        return {message: 'Aluno removido com sucesso'};
    },
};

export default AlunoService;