import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Admin = sequelize.define(
    "Admin",
    {
        id: {
            type: DataTypes.STRING(8),
            primaryKey: true,
            allowNull: false,
        },
        nome: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        usuario: {
            type: DataTypes.STRING(320),
            allowNull: false,
            unique: true,
        },
        senha: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        tableName: "administradores",
        timestamps: false,
    }
);
