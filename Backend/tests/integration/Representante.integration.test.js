import request from "supertest";
import app from "../../src/config/server.js";

import RepresentanteRepository from "../../src/repositories/RepresentanteRepository.js";

jest.mock("../../src/repositories/RepresentanteRepository.js");

describe("Integração - Representantes", () => {

    const mockRepresentante = {
        nome: "João Ribeiro",
        cargo: "Diretor",
        telefone: "(41) 99999-9999",
        escola_id: "dRFPCu0s"
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("POST /representante - cria representante (201)", async () => {
        RepresentanteRepository.create.mockResolvedValue(mockRepresentante);
        const res = await request(app)
            .post("/representante")
            .send({
                nome: "João Ribeiro",
                cargo: "Diretor",
                telefone: "(41) 99999-9999",
                escola_id: "dRFPCu0s"
            });
        expect(res.status).toBe(201);
        expect(res.body).toEqual(mockRepresentante);
        expect(RepresentanteRepository.create).toHaveBeenCalledWith({
            nome: "João Ribeiro",
            cargo: "Diretor",
            telefone: "(41) 99999-9999",
            escola_id: "dRFPCu0s"
        });
    });

    it("GET /representante - retorna todos os representantes", async () => {
        RepresentanteRepository.findAll.mockResolvedValue([mockRepresentante]);
        const res = await request(app).get("/representante");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockRepresentante]);
    });

    it("GET /representante/:id - retorna representante existente", async () => {
        RepresentanteRepository.findById.mockResolvedValue(mockRepresentante);
        const res = await request(app).get("/representante/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockRepresentante);
        expect(RepresentanteRepository.findById).toHaveBeenCalledWith("1");
    });

    it("GET /representante/:id - retorna 404 se representante não existir", async () => {
        RepresentanteRepository.findById.mockResolvedValue(null);
        const res = await request(app).get("/representante/999");
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Representante não encontrado");
    });

    it("PUT /representante/:id - atualiza representante", async () => {
        RepresentanteRepository.findById.mockResolvedValue(mockRepresentante);
        RepresentanteRepository.update.mockResolvedValue({
            ...mockRepresentante,
            nome: "Representante Atualizado"
        });
        const res = await request(app)
            .put("/representante/1")
            .send({ nome: "Representante Atualizado" });
        expect(res.status).toBe(200);
        expect(res.body.nome).toBe("Representante Atualizado");
        expect(RepresentanteRepository.update).toHaveBeenCalled();
    });

    it("DELETE /representante/:id - remove representante", async () => {
        RepresentanteRepository.findById.mockResolvedValue(mockRepresentante);
        RepresentanteRepository.remove.mockResolvedValue();
        const res = await request(app).delete("/representante/1");
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Representante removido com sucesso");
    });

});
