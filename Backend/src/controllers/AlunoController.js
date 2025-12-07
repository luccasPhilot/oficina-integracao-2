import AlunoService from '../services/AlunoService.js';

export const createAluno = async (req, res) => {
    try {
        const newData = req.body;
        const aluno = await AlunoService.createAluno(newData);
        return res.status(201).json(aluno);
    }catch (error){
        return res.status(404).json({error: error.message});
    }
};

export const getAllAlunos = async (req, res) => {
    try {
        const {search} = req.query;
        const alunos = await AlunoService.getAllAlunos(search);
        return res.status(200).json(alunos);
    } catch (error) {
        return res.status(404).json({error: error.message});
    }
};

export const getAlunoById = async (req, res) => {
    try {
        const {id} = req.params;
        const aluno = await AlunoService.getAlunoById(id);
        return res.status(200).json(aluno);
    } catch (error) {
        return res.status(404).json({error: error.message});
    }
};

export const updateAluno = async (req, res) => {
    try {
        const {id} = req.params;
        const data = req.body;
        const updatedAluno = await AlunoService.updateAluno(id, data);
        return res.status(200).json(updatedAluno);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

export const deleteAluno = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await AlunoService.deleteAluno(id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).json({error: error.message});
    }
};