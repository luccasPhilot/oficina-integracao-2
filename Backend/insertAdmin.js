// Rode este script uma vez para inserir um admin no 
// banco de dados com a senha criptografada

import 'dotenv/config';
import bcrypt from "bcryptjs";
import { Admin } from "./src/models/Admin.js";
import sequelize from "./src/config/db.js";

(async () => {
    try {
        await sequelize.sync();

        const senhaHash = await bcrypt.hash("1234", 10);

        await Admin.create({
            id: "1",
            nome: "admin",
            usuario: "admin",
            senha: senhaHash,
        });

        console.log("Admin criado com sucesso!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
