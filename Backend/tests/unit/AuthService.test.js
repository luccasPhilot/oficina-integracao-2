import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authenticate, verifyToken } from "../../src/services/AuthService.js";
import * as AdminService from "../../src/services/AdminService.js";

jest.mock("../../src/services/AdminService.js");

jest.mock("../../src/utils/Enviroments.js", () => ({
    getSecretOrEnv: jest.fn((key) => {
        if (key === "SECRET") return "testesecret";
        if (key === "TOKEN_EXPIRATION") return "3600000";
    }),
}));

describe("Unitário - AuthService", () =>{
    const fakeAdmin = {id: "1", usuario: "admin", senha: ""};

    beforeAll(async () =>{
        fakeAdmin.senha = await bcrypt.hash("1234", 10);
    });

    beforeEach(() =>{
        jest.clearAllMocks();
    });

    it("authenticate retorna token se credenciais corretas", async () =>{
        AdminService.getAdminByUser.mockResolvedValue(fakeAdmin);
        const token = await authenticate("admin", "1234");
        expect(typeof token).toBe("string");
        const decoded = jwt.verify(token, "testesecret");
        expect(decoded.id).toBe("1");
        expect(decoded.usuario).toBe("admin");
    });

    it("authenticate lança erro se usuário não encontrado", async () =>{
        AdminService.getAdminByUser.mockResolvedValue(null);
        await expect(authenticate("invalido", "1234"))
        .rejects
        .toThrow("Usuário não encontrado.");
    });

    it("authenticate lança erro se senha incorreta", async () =>{
        AdminService.getAdminByUser.mockResolvedValue(fakeAdmin);
        await expect(authenticate("admin", "senhaerrada"))
        .rejects
        .toThrow("Credenciais inválidas.");
    });

    it("verifyToken retorna válido para token correto", () =>{
        const token = jwt.sign({ id: "1", usuario: "admin" }, "testesecret", { expiresIn: "1h" });
        const result = verifyToken(token);
        expect(result.isValid).toBe(true);
        expect(result.userId).toBe("1");
        expect(result.status).toBe(200);
    });

    it("verifyToken retorna inválido para token incorreto", () =>{
        const result = verifyToken("tokeninvalido");
        expect(result.isValid).toBe(false);
        expect(result.status).toBe(401);
        expect(result.message).toBe("Token inválido.");
    });

    it("verifyToken retorna inválido se token não fornecido", () =>{
        const result = verifyToken(null);
        expect(result.isValid).toBe(false);
        expect(result.status).toBe(400);
        expect(result.message).toBe("Token não fornecido.");
    });
});
