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
            throw new Error("Escola não encontrada");
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
            throw new Error("Escola não encontrada")
        }
        return await EscolaRepository.update(escola, data);
    },

    deleteEscola: async (id) => {
        const escola = await EscolaRepository.findById(id);
        if(!escola){
            throw new Error("Escola não encontrada")
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

    gerarCartaConvenio: async (id) => {
        const escola = await EscolaRepository.findById(id);
        if(!escola){
            throw new Error('Escola não encontrada');
        }
        const docDefinition = {
            content: [
                {text: 'TERMO DE CONVÊNIO', style: 'header', alignment: 'center'},
                {text: '\n\n'},
                { 
                    text: [
                        {text: 'Pelo presente instrumento, de um lado a ', bold: true },
                        {text: 'UNIVERSIDADE TECNOLÓGICA FEDERAL DO PARANÁ (UTFPR)', bold: true },
                        {text: ', através do projeto ELLP, e de outro lado a escola '},
                        {text: escola.nome.toUpperCase(), bold: true },
                        {text: `, localizada em ${(escola.endereco + ", " + escola.cidade + ", " + escola.estado) || 'endereço não cadastrado'}, celebram o presente termo mediante as cláusulas a seguir:` }
                    ],
                    alignment: 'justify'
                },
                {text: '\n'},
                {text: 'CLÁUSULA PRIMEIRA - DO OBJETO', style: 'clauseTitle'},
                { 
                    text: 'O presente convênio tem por objetivo a cooperação mútua para a realização de oficinas de Lógica e Programação para os alunos da instituição parceira.',
                    alignment: 'justify', margin: [0, 5, 0, 10]
                },
                {text: 'CLÁUSULA SEGUNDA - DAS RESPONSABILIDADES', style: 'clauseTitle'},
                { 
                    text: 'Caberá à UTFPR fornecer os monitores e o material didático. Caberá à ESCOLA PARCEIRA organizar as turmas e garantir a frequência dos alunos.',
                    alignment: 'justify', margin: [0, 5, 0, 10]
                },
                {text: '\n\n\n'},
                {text: `Cornélio Procópio, ${new Date().toLocaleDateString('pt-BR')}`, alignment: 'right'},
                {text: '\n\n\n\n'},
                {
                    columns: [
                        {
                            stack: [
                                {text: '____________________________________'},
                                {text: 'Coordenação do Projeto ELLP', fontSize: 10, bold: true },
                                {text: 'UTFPR - Cornélio Procópio', fontSize: 9 }
                            ],
                            alignment: 'center'
                        },
                        {
                            stack: [
                                {text: '____________________________________'},
                                {text: `Direção / Representante`, fontSize: 10, bold: true },
                                {text: escola.nome, fontSize: 9 }
                            ],
                            alignment: 'center'
                        }
                    ]
                }
            ],
            styles: {
                header: { fontSize: 16, bold: true },
                clauseTitle: { fontSize: 11, bold: true, marginTop: 10 }
            },
            defaultStyle: { font: 'Helvetica'}
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