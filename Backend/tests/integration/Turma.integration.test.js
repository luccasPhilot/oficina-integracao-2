import request from "supertest";
import app from "../../src/config/server.js";

import TurmaRepository from "../../src/repositories/TurmaRepository.js";

jest.mock("../../src/repositories/TurmaRepository.js");

describe("Integração - Turmas", () => {

    const mockTurma = {
        id: "1",
        identificacao: "Turma A",
        escola_id: "10"
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("POST /turma → cria turma (201)", async () => {
        TurmaRepository.create.mockResolvedValue(mockTurma);
        const res = await request(app)
            .post("/turma")
            .send({
                identificacao: "Turma A",
                escola_id: "10"
            });
        expect(res.status).toBe(201);
        expect(res.body).toEqual(mockTurma);
        expect(TurmaRepository.create).toHaveBeenCalledWith({
            identificacao: "Turma A",
            escola_id: "10"
        });
    });

    it("GET /turma → retorna lista de turmas", async () => {
        TurmaRepository.findAll.mockResolvedValue([mockTurma]);
        const res = await request(app).get("/turma");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockTurma]);
    });

    it("GET /turma/:id → retorna turma existente", async () => {
        TurmaRepository.findById.mockResolvedValue(mockTurma);
        const res = await request(app).get("/turma/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockTurma);
        expect(TurmaRepository.findById).toHaveBeenCalledWith("1");
    });

    it("GET /turma/:id → retorna 404 se turma não existir", async () => {
        TurmaRepository.findById.mockResolvedValue(null);
        const res = await request(app).get("/turma/999");
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Turma não encontrada");
    });

    it("PUT /turma/:id → atualiza turma", async () => {
        TurmaRepository.findById.mockResolvedValue(mockTurma);
        TurmaRepository.update.mockResolvedValue({
            ...mockTurma,
            identificacao: "Turma Atualizada"
        });
        const res = await request(app)
            .put("/turma/1")
            .send({ identificacao: "Turma Atualizada" });
        expect(res.status).toBe(200);
        expect(res.body.identificacao).toBe("Turma Atualizada");
        expect(TurmaRepository.update).toHaveBeenCalled();
    });

    it("DELETE /turma/:id → remove turma", async () => {
        TurmaRepository.findById.mockResolvedValue(mockTurma);
        TurmaRepository.remove.mockResolvedValue();
        const res = await request(app).delete("/turma/1");
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Turma removida com sucesso");
    });

});
