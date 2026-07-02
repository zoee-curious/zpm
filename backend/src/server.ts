import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

import { connectDB } from './configs/db.js';
import toolRoutes from './routes/tool.routes.js';
import powershellRoutes from './routes/powershell.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL!,
    methods: 'GET',
  }),
);
app.use(helmet());
app.use(express.json());

app.use('/api', toolRoutes);
app.use(powershellRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT} | http://localhost:${PORT}`);
  });
});
