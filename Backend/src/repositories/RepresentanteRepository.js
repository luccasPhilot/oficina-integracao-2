import { Op } from 'sequelize';
import Representante from '../models/Representante.js';
import Turma from '../models/Turma.js';
import Escola from '../models/Escola.js';
import { generateRandomId } from '../utils/RandonId.js';

const RepresentanteRepository = {
    create: async (data) => {
        const id = generateRandomId();
        const newData = { ...data, id };
        return await Representante.create(newData);
    },

    findAll: async () => {
        return await Representante.findAll({
            include: [
                {
                    model: Escola,
                    attributes: ['nome'],
                    required: false
                }
            ]
        });
    },
    
    findById: async (id) => {
        return await Representante.findByPk(id, {
            include: [
                {
                    model: Escola,
                    attributes: ['nome']
                }
            ]
        });
    },
    

    update: async (aluno, data) => {
        return await aluno.update(data);
    },

    remove: async (aluno) => {
        await aluno.destroy();
    },
};
  
export default RepresentanteRepository;