import RepresentanteService from "../../src/services/RepresentanteService";
import RepresentanteRepository from "../../src/repositories/RepresentanteRepository.js";

jest.mock("../../src/repositories/RepresentanteRepository.js");

describe("Unitário - RepresentanteService", () => {
    const fakeRepresentante = {id: "1", nome: "João", idade: 18, turma_id: "1"};

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("createRepresentante chama create do Repository e retorna representante criado", async () => {
        RepresentanteRepository.create.mockResolvedValue(fakeRepresentante);
        const result = await RepresentanteService.createRepresentante(fakeRepresentante);
        expect(RepresentanteRepository.create).toHaveBeenCalledWith(fakeRepresentante);
        expect(result).toEqual(fakeRepresentante);
    });

    it("getRepresentanteById retorna representante se encontrado", async () => {
        RepresentanteRepository.findById.mockResolvedValue(fakeRepresentante);
        const result = await RepresentanteService.getRepresentanteById("1");
        expect(RepresentanteRepository.findById).toHaveBeenCalledWith("1");
        expect(result).toEqual(fakeRepresentante);
    });

    it("getRepresentanteById lança erro se representante não encontrado", async () => {
        RepresentanteRepository.findById.mockResolvedValue(null);
        await expect(RepresentanteService.getRepresentanteById("99")).rejects.toThrow("Representante não encontrado");
    });

    it("getAllRepresentantes chama findAll do Repository com search", async () => {
        RepresentanteRepository.findAll.mockResolvedValue([fakeRepresentante]);
        const result = await RepresentanteService.getAllRepresentantes("Representante");
        expect(RepresentanteRepository.findAll).toHaveBeenCalledWith("Representante");
        expect(result).toEqual([fakeRepresentante]);
    });

    it("updateRepresentante atualiza representante se encontrado", async () => {
        RepresentanteRepository.findById.mockResolvedValue(fakeRepresentante);
        RepresentanteRepository.update.mockResolvedValue({ ...fakeRepresentante, identificacao: "Fernando" });
        const result = await RepresentanteService.updateRepresentante("1", { nome: "Fernando" });
        expect(RepresentanteRepository.findById).toHaveBeenCalledWith("1");
        expect(RepresentanteRepository.update).toHaveBeenCalledWith(fakeRepresentante, { nome: "Fernando" });
        expect(result.identificacao).toBe("Fernando");
    });

    it("updateRepresentante lança erro se representante não encontrado", async () => {
        RepresentanteRepository.findById.mockResolvedValue(null);
        await expect(RepresentanteService.updateRepresentante("99", { nome: "Guilherme" })).rejects.toThrow("Representante não encontrado");
    });

    it("deleteRepresentante remove representante se encontrado", async () => {
        RepresentanteRepository.findById.mockResolvedValue(fakeRepresentante);
        RepresentanteRepository.remove.mockResolvedValue();
        const result = await RepresentanteService.deleteRepresentante("1");
        expect(RepresentanteRepository.findById).toHaveBeenCalledWith("1");
        expect(RepresentanteRepository.remove).toHaveBeenCalledWith(fakeRepresentante);
        expect(result).toEqual({message: "Representante removido com sucesso"});
    });

    it("deleteRepresentante lança erro se representante não encontrado", async () => {
        RepresentanteRepository.findById.mockResolvedValue(null);
        await expect(RepresentanteService.deleteRepresentante("99")).rejects.toThrow("Representante não encontrado");
    });
});
