import Escola from '../models/Escola.js';
import {generateRandomId } from '../utils/RandonId.js';
import { Op } from 'sequelize';

const EscolaRepository = {
    create: async (data) => {
        const id = generateRandomId();
        const newData = { ...data, id };
        return await Escola.create(newData);
    },

    findAll: async (search) => {
        const where = search
        ? {
            [Op.or]: [
                {nome: {[Op.like]: `%${search}%`} },
                {cidade: {[Op.like]: `%${search}%`} },
                {estado: {[Op.like]: `%${search}%`} },
            ],
            }
        : {};

        return await Escola.findAll({
            where,
        });
    },

    findById: async (id) => {
        return await Escola.findByPk(id);
    },

    update: async (escola, data) => {
        return await escola.update(data);
    },

    remove: async (escola) => {
        await escola.destroy();
    },
};
  
export default EscolaRepository;