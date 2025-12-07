import RepresentanteRepository from '../repositories/RepresentanteRepository.js';

const RepresentanteService = {
    createRepresentante: async (data) => {
        return await RepresentanteRepository.create(data);
    },

    getRepresentanteById: async (id) => {
        const representante = await RepresentanteRepository.findById(id);
        if (!representante) {
            throw new Error('Representante não encontrado');
        }
        return representante;
    },

    getAllRepresentantes: async (search) => {
        return await RepresentanteRepository.findAll(search);
    },

    updateRepresentante: async (id, data) => {
        const representante = await RepresentanteRepository.findById(id);
        if (!representante) {
            throw new Error('Representante não encontrado');
        }
        return await RepresentanteRepository.update(representante, data);
    },

    deleteRepresentante: async (id) => {
        const representante = await RepresentanteRepository.findById(id);
        if(!representante){
            throw new Error('Representante não encontrado');
        }
        await RepresentanteRepository.remove(representante);
        return {message: 'Representante removido com sucesso'};
    },
};

export default RepresentanteService;