import EscolaRepository from '../repositories/EscolaRepository.js';
import TurmaRepository from '../repositories/TurmaRepository.js';
import PdfPrinter from 'pdfmake';

const fonts = {
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    }
}

const EscolaService = {
    createEscola: async (data) => {
        return await EscolaRepository.create(data);
    },

    getEscolaById: async (id) => {
        const escola = await EscolaRepository.findById(id);
        if (!escola) {
            throw new Error('Escola não encontrada');
        }
        return escola;
    },

    getAllEscolas: async (search) => {
        return await EscolaRepository.findAll(search);
    },

    getAllTurmasByEscolaId: async (id) => {
        return await TurmaRepository.findAll(id);
    },

    updateEscola: async (id, data) => {
        const escola = await EscolaRepository.findById(id);
        if (!escola) {
            throw new Error('Escola não encontrada');
        }
        return await EscolaRepository.update(escola, data);
    },

    deleteEscola: async (id) => {
        const escola = await EscolaRepository.findById(id);
        if(!escola){
            throw new Error('Escola não encontrada');
        }
        await EscolaRepository.remove(escola);
        return {message: 'Escola removida com sucesso'};
    },

    gerarCartaConvite: async (id) => {
        const escola = await EscolaRepository.findById(id);
        if(!escola){
            throw new Error('Escola não encontrada');
        }
        const docDefinition = {
            content: [
                {text: 'CARTA CONVITE - PROJETO ELLP', style: 'header', alignment: 'center'},
                {text: '\n\n'},
                {text: `Cornélio Procópio, ${new Date().toLocaleDateString('pt-BR')}`, alignment: 'right'},
                {text: '\n\n'},
                {text: `Ao Diretor(a) / Responsável da escola: ${escola.nome}`, bold: true},
                {text: `Endereço: ${(escola.endereco + ", " + escola.cidade + ", " + escola.estado) || 'Não informado'}`, fontSize: 10, italics: true},
                {text: '\n'},
                { 
                text: 'Vimos por meio desta convidá-los a participar do Projeto de Extensão ELLP (Ensino Lúdico de Lógica e Programação) da UTFPR-CP.', 
                    alignment: 'justify' 
                },
                {text: '\n'},
                { 
                    text: 'Este documento tem como objetivo formalizar o convite para que seus alunos possam integrar as turmas de lógica e robótica.', 
                    alignment: 'justify' 
                },
                {text: '\n\nAtenciosamente,\n\nEquipe do Projeto ELLP', alignment: 'center', bold: true}
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true
                }
            },
            defaultStyle: {
                font: 'Helvetica'
            }
        };

        const printer = new PdfPrinter(fonts);
        const pdfDoc = printer.createPdfKitDocument(docDefinition);

        return new Promise((resolve, reject) => {
            const chunks = [];
            pdfDoc.on('data', (chunk) => chunks.push(chunk));
            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
            pdfDoc.on('error', (err) => reject(err));
            pdfDoc.end();
        });
    },
};

export default EscolaService;