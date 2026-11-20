require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { apiRateLimit } = require('./middlewares/rateLimiters');

const apiRouter = require('./Router');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

const allowedOrigins = new Set(
    [
        process.env.CLIENT_ORIGIN,
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ].filter(Boolean)
);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) {
            callback(null, true);
            return;
        }
        callback(null, false);
    },
    credentials: true,
}));

const PORT = process.env.PORT || 4000;

app.use('/api', apiRateLimit, apiRouter);

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
};

startServer().catch((error) => {
    console.error('Server startup failed:', error.message);
    process.exitCode = 1;
});