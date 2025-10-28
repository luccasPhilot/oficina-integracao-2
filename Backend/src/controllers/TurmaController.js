import TurmaService from '../services/TurmaService.js';

export const createTurma = async (req, res) => {
    try {
        const newData = req.body;
        const turma = await TurmaService.createTurma(newData);
        return res.status(200).json(turma);
    }catch (error){
        return res.status(404).json({message: error.message});
    }
};

export const getAllTurmas = async (req, res) => {
    try {
        const {search} = req.query;
        const turmas = await TurmaService.getAllTurmas(search);
        return res.status(200).json(turmas);
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
};

export const getTurmaById = async (req, res) => {
    try {
        const {id} = req.params;
        const turma = await TurmaService.getTurmaById(id);
        return res.status(200).json(turma);
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
};

export const updateTurma = async (req, res) => {
    try {
        const {id} = req.params;
        const data = req.body;
        const updatedTurma = await TurmaService.updateTurma(id, data);
        return res.status(200).json(updatedTurma);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

export const deleteTurma = async (req, res) => {
    try {
        const {id} = req.params;
        await TurmaService.deleteTurma(id);
        return res.status(200).json({message: 'Turma apagada' });
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
};