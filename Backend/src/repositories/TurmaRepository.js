import { Op } from 'sequelize';
import Escola from '../models/Escola.js';
import Turma from '../models/Turma.js';
import { generateRandomId } from '../utils/RandonId.js';

const TurmaRepository = {
    create: async (data) => {
        const id = generateRandomId();
        const newData = { ...data, id };
        return await Turma.create(newData);
    },

    findAll: async (search) => {
        const whereTurma = search
            ? {
                [Op.or]: [
                {identificacao: {[Op.like]:`%${search}%`}},
                {escola_id: {[Op.like]:`%${search}%`}},
                ],
            }
            : {};

        const whereEscola = search
            ? {
                nome: {[Op.like]: `%${search}%`},
            }
            : {};

        return await Turma.findAll({
            where: whereTurma,
            include: [
            {
                model: Escola,
                attributes: ['nome'],
                where: whereEscola,
                required: false,
            },
            ],
        });
    },

    findById: async (id) => {
        return await Turma.findByPk(id);
    },

    update: async (turma, data) => {
        return await turma.update(data);
    },

    remove: async (turma) => {
        await turma.destroy();
    },
};
  
export default TurmaRepository;