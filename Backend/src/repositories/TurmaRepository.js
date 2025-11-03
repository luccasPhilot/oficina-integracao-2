import { Op } from 'sequelize';
import Escola from '../models/Escola.js';
import Turma from '../models/Turma.js';
import Aluno from '../models/Aluno.js';
import { generateRandomId } from '../utils/RandonId.js';

const TurmaRepository = {
    create: async (data) => {
        const id = generateRandomId();
        const newData = { ...data, id };
        return await Turma.create(newData);
    },

    findAll: async () => {
        return await Turma.findAll({
            include: [
            {
                model: Escola,
                attributes: ["nome"],
                required: false,
            },
            {
                model: Aluno,
                attributes: ["id", "nome", "idade"],
                required: false,
            },
            ],
        });
    },

    findById: async (id) => {
        return await Turma.findByPk(id, {
            include: [
            {
                model: Escola,
                attributes: ["nome"],
                required: false,
            },
            {
                model: Aluno,
                attributes: ["id", "nome", "idade"],
                required: false,
            },
            ],
        });
    },

    update: async (turma, data) => {
        return await turma.update(data);
    },

    remove: async (turma) => {
        await turma.destroy();
    },
};
  
export default TurmaRepository;