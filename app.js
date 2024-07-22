import { config } from 'dotenv';
import { resolve } from 'path';
import express from 'express';
import cors from 'cors';
import accountRoutes from './routes/accountRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import loginRoutes from './routes/loginRoutes.js';

// Load environment variables from the .env file based on NODE_ENV
config({ path: resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all origins
app.use(cors());

// Use routes
app.use('/api/account', accountRoutes);
app.use('/api/settings', settingsRoutes);
app.use('', loginRoutes);

// Get the port from environment variables or use 3000 as default
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
