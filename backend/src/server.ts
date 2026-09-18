import app from './app';
import { config } from './config/env';

const PORT = Number(config.port) || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`ReProof backend running on http://${HOST}:${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
