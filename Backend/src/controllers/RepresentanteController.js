import RepresentanteService from '../services/RepresanteService.js';

export const createRepresentante = async (req, res) => {
    try {
        const newData = req.body;
        const representante = await RepresentanteService.createRepresentante(newData);
        return res.status(201).json(representante);
    }catch (error){
        return res.status(404).json({error: error.message});
    }
};

export const getAllRepresentantes = async (req, res) => {
    try {
        const {search} = req.query;
        const representantes = await RepresentanteService.getAllRepresentantes(search);
        return res.status(200).json(representantes);
    } catch (error) {
        return res.status(404).json({error: error.message});
    }
};

export const getRepresentanteById = async (req, res) => {
    try {
        const {id} = req.params;
        const representante = await RepresentanteService.getRepresentanteById(id);
        return res.status(200).json(representante);
    } catch (error) {
        return res.status(404).json({error: error.message});
    }
};

export const updateRepresentante = async (req, res) => {
    try {
        const {id} = req.params;
        const data = req.body;
        const updatedRepresentante = await RepresentanteService.updateRepresentante(id, data);
        return res.status(200).json(updatedRepresentante);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

export const deleteRepresentante = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await RepresentanteService.deleteRepresentante(id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).json({error: error.message});
    }
};