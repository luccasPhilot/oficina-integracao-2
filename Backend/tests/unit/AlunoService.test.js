import AlunoService from "../../src/services/AlunoService.js";
import AlunoRepository from "../../src/repositories/AlunoRepository.js";

jest.mock("../../src/repositories/AlunoRepository.js");

describe("AlunoService unit tests", () => {
    const fakeAluno = {id: "1", nome: "João", idade: 18, turma_id: "1"};

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("createAluno chama create do Repository e retorna aluno criada", async () => {
        AlunoRepository.create.mockResolvedValue(fakeAluno);
        const result = await AlunoService.createAluno(fakeAluno);
        expect(AlunoRepository.create).toHaveBeenCalledWith(fakeAluno);
        expect(result).toEqual(fakeAluno);
    });

    it("getAlunoById retorna aluno se encontrado", async () => {
        AlunoRepository.findById.mockResolvedValue(fakeAluno);
        const result = await AlunoService.getAlunoById("1");
        expect(AlunoRepository.findById).toHaveBeenCalledWith("1");
        expect(result).toEqual(fakeAluno);
    });

    it("getAlunoById lança erro se aluno não encontrado", async () => {
        AlunoRepository.findById.mockResolvedValue(null);
        await expect(AlunoService.getAlunoById("99")).rejects.toThrow("Aluno não encontrado");
    });

    it("getAllAlunos chama findAll do Repository com search", async () => {
        AlunoRepository.findAll.mockResolvedValue([fakeAluno]);
        const result = await AlunoService.getAllAlunos("Aluno");
        expect(AlunoRepository.findAll).toHaveBeenCalledWith("Aluno");
        expect(result).toEqual([fakeAluno]);
    });

    it("updateAluno atualiza aluno se encontrado", async () => {
        AlunoRepository.findById.mockResolvedValue(fakeAluno);
        AlunoRepository.update.mockResolvedValue({ ...fakeAluno, identificacao: "Fernando" });
        const result = await AlunoService.updateAluno("1", { nome: "Fernando" });
        expect(AlunoRepository.findById).toHaveBeenCalledWith("1");
        expect(AlunoRepository.update).toHaveBeenCalledWith(fakeAluno, { nome: "Fernando" });
        expect(result.identificacao).toBe("Fernando");
    });

    it("updateAluno lança erro se aluno não encontrado", async () => {
        AlunoRepository.findById.mockResolvedValue(null);
        await expect(AlunoService.updateAluno("99", { nome: "Guilherme" })).rejects.toThrow("Aluno não encontrado");
    });

    it("deleteAluno remove aluno se encontrado", async () => {
        AlunoRepository.findById.mockResolvedValue(fakeAluno);
        AlunoRepository.remove.mockResolvedValue();
        const result = await AlunoService.deleteAluno("1");
        expect(AlunoRepository.findById).toHaveBeenCalledWith("1");
        expect(AlunoRepository.remove).toHaveBeenCalledWith(fakeAluno);
        expect(result).toEqual({message: "Aluno removido com sucesso"});
    });

    it("deleteAluno lança erro se aluno não encontrado", async () => {
        AlunoRepository.findById.mockResolvedValue(null);
        await expect(AlunoService.deleteAluno("99")).rejects.toThrow("Aluno não encontrado");
    });
});
