import healthService from "../services/healthService.js";

export const isAlive = (req, res) => {
  const status = healthService.checkStatus();
  res.json({ alive: status });
};
