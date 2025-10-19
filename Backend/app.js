import 'dotenv/config';

import app from "./src/config/server.js";
import { testConnection } from "./src/utils/TestConnection.js";


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  testConnection();
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
