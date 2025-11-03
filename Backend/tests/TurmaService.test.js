import TurmaService from "../src/services/TurmaService.js";
import TurmaRepository from "../src/repositories/TurmaRepository.js";

jest.mock("../src/repositories/TurmaRepository.js");

describe("TurmaService unit tests", () => {
    const fakeTurma = {id: "1", identificacao: "Turma A", escola_id: "1"};

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("createTurma chama create do Repository e retorna turma criada", async () => {
        TurmaRepository.create.mockResolvedValue(fakeTurma);
        const result = await TurmaService.createTurma(fakeTurma);
        expect(TurmaRepository.create).toHaveBeenCalledWith(fakeTurma);
        expect(result).toEqual(fakeTurma);
    });

    it("getTurmaById retorna turma se encontrada", async () => {
        TurmaRepository.findById.mockResolvedValue(fakeTurma);
        const result = await TurmaService.getTurmaById("1");
        expect(TurmaRepository.findById).toHaveBeenCalledWith("1");
        expect(result).toEqual(fakeTurma);
    });

    it("getTurmaById lança erro se turma não encontrada", async () => {
        TurmaRepository.findById.mockResolvedValue(null);
        await expect(TurmaService.getTurmaById("99")).rejects.toThrow("Turma não encontrada");
    });

    it("getAllTurmas chama findAll do Repository com search", async () => {
        TurmaRepository.findAll.mockResolvedValue([fakeTurma]);
        const result = await TurmaService.getAllTurmas("Turma");
        expect(TurmaRepository.findAll).toHaveBeenCalledWith("Turma");
        expect(result).toEqual([fakeTurma]);
    });

    it("updateTurma atualiza turma se encontrada", async () => {
        TurmaRepository.findById.mockResolvedValue(fakeTurma);
        TurmaRepository.update.mockResolvedValue({ ...fakeTurma, identificacao: "Turma B" });
        const result = await TurmaService.updateTurma("1", { identificacao: "Turma B" });
        expect(TurmaRepository.findById).toHaveBeenCalledWith("1");
        expect(TurmaRepository.update).toHaveBeenCalledWith(fakeTurma, { identificacao: "Turma B" });
        expect(result.identificacao).toBe("Turma B");
    });

    it("updateTurma lança erro se turma não encontrada", async () => {
        TurmaRepository.findById.mockResolvedValue(null);

        await expect(TurmaService.updateTurma("99", { identificacao: "Turma B" })).rejects.toThrow("Turma não encontrada");
    });

    it("deleteTurma remove turma se encontrada", async () => {
        TurmaRepository.findById.mockResolvedValue(fakeTurma);
        TurmaRepository.remove.mockResolvedValue();
        const result = await TurmaService.deleteTurma("1");
        expect(TurmaRepository.findById).toHaveBeenCalledWith("1");
        expect(TurmaRepository.remove).toHaveBeenCalledWith(fakeTurma);
        expect(result).toEqual({message: "Turma removida com sucesso"});
    });

    it("deleteTurma lança erro se turma não encontrada", async () => {
        TurmaRepository.findById.mockResolvedValue(null);
        await expect(TurmaService.deleteTurma("99")).rejects.toThrow("Turma não encontrada");
    });
});
