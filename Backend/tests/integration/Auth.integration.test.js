import request from "supertest";
import app from "../../src/config/server.js";

import { authenticate, verifyToken } from "../../src/services/AuthService.js";

jest.mock("../../src/services/AuthService.js");

describe("Integração - Auth", () => {
    const mockToken = "fake.jwt.token";
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it("POST /auth/login - retorna 400 se faltar dados", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ user: "admin" });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("'user' e 'password' são obrigatórios.");
    });

    it("POST /auth/login - retorna 401 se credenciais inválidas", async () => {
        authenticate.mockRejectedValue(new Error("Credenciais inválidas"));
        const res = await request(app)
            .post("/auth/login")
            .send({ user: "admin", password: "errado" });
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Credenciais inválidas");
    });

    it("POST /auth/logout - remove cookie e retorna 200", async () => {
        const res = await request(app).post("/auth/logout");
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Logout realizado com sucesso");
        expect(res.headers["set-cookie"][0]).toContain("token=;");
    });

    it("GET /auth/validate - retorna validação do token via verifyToken", async () => {
        verifyToken.mockReturnValue({
            status: 200,
            message: "Token válido"
        });
        const res = await request(app)
            .get("/auth/validate")
            .set("Cookie", [`token=${mockToken}`])
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Token válido");
        expect(verifyToken).toHaveBeenCalledWith(mockToken);
    });

    it("GET /auth/validate - retorna 401 se token inválido", async () => {
        verifyToken.mockReturnValue({
            status: 401,
            message: "Token inválido"
        });
        const res = await request(app)
            .get("/auth/validate")
            .set("Cookie", ["token=invalid"]);
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Token inválido");
    });
});
