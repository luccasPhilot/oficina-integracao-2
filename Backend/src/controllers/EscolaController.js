import EscolaService from '../services/EscolaService.js';

export const createEscola = async (req, res) => {
    try {
        const newData = req.body;
        const escola = await EscolaService.createEscola(newData);
        return res.status(201).json(escola);
    }catch (error){
        return res.status(404).json({error: error.message});
    }
};

export const getAllEscolas = async (req, res) => {
    try {
        const {search} = req.query;
        const escolas = await EscolaService.getAllEscolas(search);
        return res.status(200).json(escolas);
    } catch (error) {
        return res.status(404).json({error: error.message});
    }
};

export const getAllTurmasByEscolaId = async (req, res) => {
    try {
        const {id} = req.params;
        const turmas = await EscolaService.getAllTurmasByEscolaId(id);
        return res.status(200).json(turmas);
    } catch (error) {
        return res.status(404).json({error: error.message});
    }
};

export const getEscolaById = async (req, res) => {
    try {
        const {id} = req.params;
        const escola = await EscolaService.getEscolaById(id);
        if(!escola){
            return res.status(404).json({ error: "Escola não encontrada" });
        }
        return res.status(200).json(escola);
    } catch (error) {
        return res.status(404).json({error: error.message});
    }
};

export const updateEscola = async (req, res) => {
    try {
        const {id} = req.params;
        const data = req.body;
        const escola = await EscolaService.getEscolaById(id);
        if (!escola) {
            return res.status(404).json({ error: "Escola não encontrada" });
        }
        const updatedEscola = await EscolaService.updateEscola(id, data);
        return res.status(200).json(updatedEscola);
    } catch (error) {
        return res.status(404).json({error: error.message});
    }
};

export const deleteEscola = async (req, res) => {
    try {
        const {id} = req.params;
        const escola = await EscolaService.getEscolaById(id);
        if (!escola) {
            return res.status(404).json({ error: "Escola não encontrada" });
        }
        const result = await EscolaService.deleteEscola(id);
        return res.status(200).json(result); 
    } catch (error) {
        return res.status(404).json({error: error.message});
    }
};

export const createCartaConvite = async (req, res) => {
    try {
        const { id } = req.params;
        const pdfBuffer = await EscolaService.gerarCartaConvite(id);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=carta-convite-escola-${id}.pdf`,
            'Content-Length': pdfBuffer.length.toString()
        });
        return res.send(pdfBuffer);
    } catch (error) {
        return res.status(404).json({error: error.message});
    }
};

export const createCartaConvenio = async (req, res) => {
    try {
        const { id } = req.params;
        const pdfBuffer = await EscolaService.gerarCartaConvenio(id);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=carta-convenio-escola-${id}.pdf`,
            'Content-Length': pdfBuffer.length.toString()
        });
        return res.send(pdfBuffer);
    } catch (error) {
        return res.status(404).json({error: error.message});
    }
};