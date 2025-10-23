import EscolaService from '../services/EscolaService.js';

export const createEscola = async (req, res) => {
    try {
        const newData = req.body;
        const escola = await EscolaService.createEscola(newData);
        return res.status(200).json(escola);
    }catch (error){
        return res.status(404).json({message: error.message});
    }
};

export const getAllEscolas = async (req, res) => {
    try {
        const {search} = req.query;
        const escolas = await EscolaService.getAllEscolas(search);
        return res.status(200).json(escolas);
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
};

export const getEscolaById = async (req, res) => {
    try {
        const {id} = req.params;
        const escola = await EscolaService.getEscolaById(id);
        return res.status(200).json(escola);
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
};

export const updateEscola = async (req, res) => {
    try {
        const {id} = req.params;
        const data = req.body;
        console.log(data)
        const updatedEscola = await EscolaService.updateEscola(id, data);
        return res.status(200).json(updatedEscola);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

export const deleteEscola = async (req, res) => {
    try {
        const {id} = req.params;
        await EscolaService.deleteEscola(id);
        return res.status(200).json({message: 'Escola apagada' });
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
};