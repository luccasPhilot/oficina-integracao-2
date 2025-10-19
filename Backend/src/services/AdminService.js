import { AdminRepository } from "../repositories/AdminRepository.js";

export async function getUserById(id) {
    const user = await AdminRepository.findById(id);
    if (!user) {
        throw new Error("Usuário não encontrado");
    }
    return user;
}

export async function getAdminByUser(username) {
    const admin = await AdminRepository.findByUsername(username);
    if (!admin) {
        throw new Error("Usuário não encontrado");
    }
    return admin;
}
