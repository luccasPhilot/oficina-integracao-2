import request from "supertest";
import app from "../../src/config/server.js";

import AlunoRepository from "../../src/repositories/AlunoRepository.js";

jest.mock("../../src/repositories/AlunoRepository.js");

describe("Integração - Alunos", () => {

    const mockAluno = {
        id: "1",
        nome: "João Pedro",
        idade: 15,
        turma_id: "10"
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("POST /aluno - cria aluno (201)", async () => {
        AlunoRepository.create.mockResolvedValue(mockAluno);
        const res = await request(app)
            .post("/aluno")
            .send({
                nome: "João Pedro",
                idade: 15,
                turma_id: "10"
            });
        expect(res.status).toBe(201);
        expect(res.body).toEqual(mockAluno);
        expect(AlunoRepository.create).toHaveBeenCalledWith({
            nome: "João Pedro",
            idade: 15,
            turma_id: "10"
        });
    });

    it("GET /aluno - retorna todos os alunos", async () => {
        AlunoRepository.findAll.mockResolvedValue([mockAluno]);
        const res = await request(app).get("/aluno");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockAluno]);
    });

    it("GET /aluno/:id - retorna aluno existente", async () => {
        AlunoRepository.findById.mockResolvedValue(mockAluno);
        const res = await request(app).get("/aluno/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockAluno);
        expect(AlunoRepository.findById).toHaveBeenCalledWith("1");
    });

    it("GET /aluno/:id - retorna 404 se aluno não existir", async () => {
        AlunoRepository.findById.mockResolvedValue(null);
        const res = await request(app).get("/aluno/999");
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Aluno não encontrado");
    });

    it("PUT /aluno/:id - atualiza aluno", async () => {
        AlunoRepository.findById.mockResolvedValue(mockAluno);
        AlunoRepository.update.mockResolvedValue({
            ...mockAluno,
            nome: "Aluno Atualizado"
        });
        const res = await request(app)
            .put("/aluno/1")
            .send({ nome: "Aluno Atualizado" });
        expect(res.status).toBe(200);
        expect(res.body.nome).toBe("Aluno Atualizado");
        expect(AlunoRepository.update).toHaveBeenCalled();
    });

    it("DELETE /aluno/:id - remove aluno", async () => {
        AlunoRepository.findById.mockResolvedValue(mockAluno);
        AlunoRepository.remove.mockResolvedValue();
        const res = await request(app).delete("/aluno/1");
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Aluno removido com sucesso");
    });

});
