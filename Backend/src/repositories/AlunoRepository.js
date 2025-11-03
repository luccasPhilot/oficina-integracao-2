import { Op } from 'sequelize';
import Aluno from '../models/Aluno.js';
import Turma from '../models/Turma.js';
import Escola from '../models/Escola.js';
import { generateRandomId } from '../utils/RandonId.js';

const AlunoRepository = {
    create: async (data) => {
        const id = generateRandomId();
        const newData = { ...data, id };
        return await Aluno.create(newData);
    },

    findAll: async () => {
        return await Aluno.findAll({
            include: [
                {
                    model: Turma,
                    attributes: ['identificacao'],
                    required: false,
                    include: [
                        {
                            model: Escola,
                            attributes: ['nome'],
                            required: false,
                        },
                    ],
                },
            ],
        });
    },

    findById: async (id) => {
        return await Aluno.findByPk(id, {
            include: [
                {
                    model: Turma,
                    attributes: ['identificacao'],
                    include: [
                        {
                            model: Escola,
                            attributes: ['nome'],
                        },
                    ],
                },
            ],
        });
    },

    update: async (aluno, data) => {
        return await aluno.update(data);
    },

    remove: async (aluno) => {
        await aluno.destroy();
    },
};
  
export default AlunoRepository;