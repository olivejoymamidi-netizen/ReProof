import app from './app';
import { config } from './config/env';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`ReProof backend running on http://localhost:${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
