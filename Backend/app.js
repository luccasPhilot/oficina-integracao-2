import 'dotenv/config';

import app from "./src/config/server.js";
import { testConnection } from "./src/utils/TestConnection.js";


const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  testConnection();
  console.log(`🚀 Servidor de oficina 2 rodando na porta ${PORT}`);
});
