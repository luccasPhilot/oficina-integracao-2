import request from "supertest";
import app from "../../src/config/server.js";

import EscolaRepository from "../../src/repositories/EscolaRepository.js";
import TurmaRepository from "../../src/repositories/TurmaRepository.js";

jest.mock("../../src/repositories/EscolaRepository.js");
jest.mock("../../src/repositories/TurmaRepository.js");

describe("Integração - Escolas", () => {
    const mockEscola = {
        id: "1",
        nome: "Escola Teste",
        cidade: "Londrina"
    };

    const mockTurma = [
        {identificacao: "Turma A", escola_id: "1"},
        {identificacao: "Turma B", escola_id: "1"}
    ];

    beforeEach(() => jest.clearAllMocks());

    it("POST /escola - cria escola (201)", async () => {
        EscolaRepository.create.mockResolvedValue(mockEscola);
        const res = await request(app)
            .post("/escola")
            .send({
                nome: "Escola Teste",
                cidade: "Londrina"
            });
        expect(res.status).toBe(201);
        expect(res.body).toEqual(mockEscola);
        expect(EscolaRepository.create).toHaveBeenCalledWith({
            nome: "Escola Teste",
            cidade: "Londrina"
        });
    });

    it("GET /escola - retorna lista de escolas", async () => {
        EscolaRepository.findAll.mockResolvedValue([mockEscola]);
        const res = await request(app).get("/escola");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockEscola]);
    });

    it("GET /escola/:id - retorna escola existente", async () => {
        EscolaRepository.findById.mockResolvedValue(mockEscola);
        const res = await request(app).get("/escola/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockEscola);
        expect(EscolaRepository.findById).toHaveBeenCalledWith("1");
    });

    it("GET /escola/:id - retorna 404 se não existir", async () => {
        EscolaRepository.findById.mockResolvedValue(null);
        const res = await request(app).get("/escola/999");
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Escola não encontrada");
    });

    it("PUT /escola/:id - atualiza escola", async () => {
        EscolaRepository.findById.mockResolvedValue(mockEscola);
        EscolaRepository.update.mockResolvedValue({
            ...mockEscola,
            nome: "Escola Atualizada"
        });
        const res = await request(app)
            .put("/escola/1")
            .send({ nome: "Escola Atualizada" });
        expect(res.status).toBe(200);
        expect(res.body.nome).toBe("Escola Atualizada");
        expect(EscolaRepository.update).toHaveBeenCalled();
    });

    it("DELETE /escola/:id - remove escola", async () => {
        EscolaRepository.findById.mockResolvedValue(mockEscola);
        EscolaRepository.remove.mockResolvedValue();
        const res = await request(app).delete("/escola/1");
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Escola removida com sucesso");
    });

    it("GET /escola/:id/turmas - retorna turmas da escola", async () => {
        EscolaRepository.findById.mockResolvedValue(mockEscola);
        TurmaRepository.findAll.mockResolvedValue(mockTurma);
        const res = await request(app).get("/escola/1/turmas");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockTurma);
    });
});
