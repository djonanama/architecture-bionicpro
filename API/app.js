require('dotenv').config();
const express = require('express');
const reportsRouter = require('./routes/reports');
const cors = require('cors');

const app = express();
const PORT = process.env.API_PORT || 8000;

app.use(cors({
    origin: process.env.API_CORS_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use('/reports', reportsRouter);

app.listen(PORT, () => {
    console.log(`API server running at http://localhost:${PORT}`);
});
