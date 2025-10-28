import TurmaRepository from '../repositories/TurmaRepository.js';

const TurmaService = {
    createTurma: async (data) => {
        return await TurmaRepository.create(data);
    },

    getTurmaById: async (id) => {
        const turma = await TurmaRepository.findById(id);
        if (!turma) {
            throw new Error('Turma não encontrada');
        }
        return turma;
    },

    getAllTurmas: async (search) => {
        return await TurmaRepository.findAll(search);
    },

    updateTurma: async (id, data) => {
        const turma = await TurmaRepository.findById(id);
        if (!turma) {
            throw new Error('Turma não encontrada');
        }
        return await TurmaRepository.update(turma, data);
    },

    deleteTurma: async (id) => {
        const turma = await TurmaRepository.findById(id);
        if(!turma){
            throw new Error('Turma não encontrada');
        }
        await TurmaRepository.remove(turma);
        return {message: 'Turma removida com sucesso'};
    },
};

export default TurmaService;