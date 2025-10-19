import { Admin } from "../models/Admin.js";

export const AdminRepository = {
    async findById(id) {
        return await Admin.findByPk(id);
    },

    async findByUsername(usuario) {
        return await Admin.findOne({ where: { usuario } });
    },
};
