import fs from "fs";

export function getSecretOrEnv(name) {
  const secretPath = `/run/secrets/${name}`;
  if (fs.existsSync(secretPath)) {
    return fs.readFileSync(secretPath, "utf8").trim();
  }
  return process.env[name];
}