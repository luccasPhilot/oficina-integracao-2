import EscolaRepository from '../repositories/EscolaRepository.js';
import TurmaRepository from '../repositories/TurmaRepository.js';

const EscolaService = {
    createEscola: async (data) => {
        return await EscolaRepository.create(data);
    },

    getEscolaById: async (id) => {
        const escola = await EscolaRepository.findById(id);
        if (!escola) {
            throw new Error('Escola não encontrada');
        }
        return escola;
    },

    getAllEscolas: async (search) => {
        return await EscolaRepository.findAll(search);
    },

    getAllTurmasByEscolaId: async (id) => {
        return await TurmaRepository.findAll(id);
    },

    updateEscola: async (id, data) => {
        const escola = await EscolaRepository.findById(id);
        if (!escola) {
            throw new Error('Escola não encontrada');
        }
        return await EscolaRepository.update(escola, data);
    },

    deleteEscola: async (id) => {
        const escola = await EscolaRepository.findById(id);
        if(!escola){
            throw new Error('Escola não encontrada');
        }
        await EscolaRepository.remove(escola);
        return {message: 'Escola removida com sucesso'};
    },
};

export default EscolaService;