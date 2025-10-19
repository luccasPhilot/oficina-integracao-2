import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getAdminByUser } from "./AdminService.js";
import { getSecretOrEnv } from "../utils/Enviroments.js";

const SECRET = getSecretOrEnv("SECRET");
const TOKEN_EXPIRATION = parseInt(getSecretOrEnv("TOKEN_EXPIRATION"));

export const authenticate = async (usuario, senha) => {
  const admin = await getAdminByUser(usuario);
  if (!admin) throw new Error("Usuário não encontrado.");

  const isMatch = await bcrypt.compare(senha, admin.senha);
  if (!isMatch) throw new Error("Credenciais inválidas.");

  const token = jwt.sign({ id: admin.id, usuario: admin.usuario }, SECRET, {
    expiresIn: TOKEN_EXPIRATION,
  });

  return token;
};

export const verifyToken = (token) => {
  if (!token) return { isValid: false, message: "Token não fornecido.", status: 400 };

  try {
    const decoded = jwt.verify(token, SECRET);
    return { isValid: true, userId: decoded.id, status: 200 };
  } catch (err) {
    return { isValid: false, message: "Token inválido.", status: 401 };
  }
};
