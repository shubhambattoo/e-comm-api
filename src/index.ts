import dotenv from 'dotenv';
import express from 'express';
import router from './routes';

dotenv.config();
const app = express();

app.use(express.json({ limit: '10kb' }));
const PORT = process.env.PORT || 3030;

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`🚀 server is running on: PORT ${PORT}\n`);
});
