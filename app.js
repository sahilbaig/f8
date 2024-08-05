import { config } from 'dotenv';
import { resolve } from 'path';
import express from 'express';
import cors from 'cors';
import accountRoutes from './routes/accountRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import indexRoutes from './routes/indexRoutes.js'
import logsRoutes from './routes/logsRoutes.js'
import networkRoutes from './routes/networkRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js';
import updatesRoutes from './routes/updatesRoutes.js'
import metallicRoutes from './routes/metallicRoutes.js'

config({ path: resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all origins
app.use(cors());

// Use routes
app.use('/accounts', accountRoutes);
app.use('/api/settings', settingsRoutes);
app.use('', loginRoutes);
app.use('/index/api/', indexRoutes)
app.use('/logs', logsRoutes)
app.use('/network', networkRoutes)
app.use('/service', serviceRoutes);
app.use('/updates', updatesRoutes);
app.use('/metallic', metallicRoutes)
// Get the port from environment variables or use 3000 as default
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

