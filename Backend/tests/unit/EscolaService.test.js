import EscolaService from "../../src/services/EscolaService.js";
import EscolaRepository from "../../src/repositories/EscolaRepository.js";
import TurmaRepository from "../../src/repositories/TurmaRepository.js";

jest.mock("../../src/repositories/EscolaRepository.js");
jest.mock("../../src/repositories/TurmaRepository.js");

jest.mock("pdfmake", () => {
    return class PdfPrinter {
        createPdfKitDocument() {
            return {
                on: (event, callback)=>{
                    if (event === 'data') callback(Buffer.from('Conteudo Falso do PDF'));
                    if (event === 'end') callback();
                },
                end: jest.fn()
            };
        }
    };
});

describe("Unitário - EscolaService", () => {
    const fakeEscola = {id: "1", nome: "Escola do Robinho", cidade: "Cidade Grande"};

    const fakeTurmas = [
        {identificacao: "Turma A", escola_id: "1"},
        {identificacao: "Turma B", escola_id: "1"},
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("createEscola chama create do Repository e retorna escola criada", async () => {
        EscolaRepository.create.mockResolvedValue(fakeEscola);
        const result = await EscolaService.createEscola(fakeEscola);
        expect(EscolaRepository.create).toHaveBeenCalledWith(fakeEscola);
        expect(result).toEqual(fakeEscola);
        });

    it("getEscolaById retorna escola se encontrada", async () => {
        EscolaRepository.findById.mockResolvedValue(fakeEscola);
        const result = await EscolaService.getEscolaById("1");
        expect(EscolaRepository.findById).toHaveBeenCalledWith("1");
        expect(result).toEqual(fakeEscola);
    });

    it("getEscolaById lança erro se escola não encontrada", async () => {
        EscolaRepository.findById.mockResolvedValue(null);
        await expect(EscolaService.getEscolaById("99")).rejects.toThrow("Escola não encontrada");
    });

    it("getAllEscolas chama findAll do Repository com search", async () => {
        EscolaRepository.findAll.mockResolvedValue([fakeEscola]);
        const result = await EscolaService.getAllEscolas("Teste");
        expect(EscolaRepository.findAll).toHaveBeenCalledWith("Teste");
        expect(result).toEqual([fakeEscola]);
    });

    it("getAllTurmasByEscolaId chama findAll do Repository de Turma e retorna turmas", async () => {
        TurmaRepository.findAll.mockResolvedValue(fakeTurmas);
        const result = await EscolaService.getAllTurmasByEscolaId("1");
        expect(TurmaRepository.findAll).toHaveBeenCalledWith("1");
        expect(result).toEqual(fakeTurmas);
    });

    it("updateEscola atualiza escola se encontrada", async () => {
        EscolaRepository.findById.mockResolvedValue(fakeEscola);
        EscolaRepository.update.mockResolvedValue({ ...fakeEscola, nome: "Nova Escola" });
        const result = await EscolaService.updateEscola("1", { nome: "Nova Escola" });
        expect(EscolaRepository.findById).toHaveBeenCalledWith("1");
        expect(EscolaRepository.update).toHaveBeenCalledWith(fakeEscola, { nome: "Nova Escola" });
        expect(result.nome).toBe("Nova Escola");
    });

    it("updateEscola lança erro se escola não encontrada", async () => {
        EscolaRepository.findById.mockResolvedValue(null);
        await expect(EscolaService.updateEscola("99", { nome: "Nova Escola" })).rejects.toThrow("Escola não encontrada");
    });

    it("deleteEscola remove escola se encontrada", async () => {
        EscolaRepository.findById.mockResolvedValue(fakeEscola);
        EscolaRepository.remove.mockResolvedValue();
        const result = await EscolaService.deleteEscola("1");
        expect(EscolaRepository.findById).toHaveBeenCalledWith("1");
        expect(EscolaRepository.remove).toHaveBeenCalledWith(fakeEscola);
        expect(result).toEqual({ message: "Escola removida com sucesso" });
    });

    it("deleteEscola lança erro se escola não encontrada", async () => {
        EscolaRepository.findById.mockResolvedValue(null);
        await expect(EscolaService.deleteEscola("99")).rejects.toThrow("Escola não encontrada");
    });

    it("gerarCartaConvite retorna um Buffer se a escola for encontrada", async () => {
        EscolaRepository.findById.mockResolvedValue(fakeEscola);
        const result = await EscolaService.gerarCartaConvite("1");
        expect(EscolaRepository.findById).toHaveBeenCalledWith("1");
        expect(result).toBeInstanceOf(Buffer);
    });

    it("gerarCartaConvite lança erro se escola não encontrada", async () => {
        EscolaRepository.findById.mockResolvedValue(null);
        await expect(EscolaService.gerarCartaConvite("99"))
            .rejects
            .toThrow("Escola não encontrada");
    });
});
