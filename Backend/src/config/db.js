import { Sequelize } from "sequelize";
import { getSecretOrEnv } from "../utils/Enviroments.js";

export const sequelize = new Sequelize(
  getSecretOrEnv("DB_NAME"),
  getSecretOrEnv("DB_USER"),
  getSecretOrEnv("DB_PASS"),
  {
    host: getSecretOrEnv("DB_HOST"),
    port: getSecretOrEnv("DB_PORT"),
    dialect: "postgres",
    logging: false,
  }
);
