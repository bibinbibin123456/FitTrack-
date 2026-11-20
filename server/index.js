require("dotenv").config({
    path: require("path").join(__dirname, ".env")
});

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const { apiRateLimit } = require("./middlewares/rateLimiters");
const apiRouter = require("./Router");

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(express.json({
    limit: "1mb"
}));

app.use(cookieParser());


// Allowed frontend origins
const allowedOrigins = new Set(
    [
        process.env.CLIENT_ORIGIN,
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ].filter(Boolean)
);


// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));


// API routes
app.use(
    "/api",
    async (req, res, next) => {
        try {
            await connectDB();
            next();
        } catch (error) {
            console.error(
                "Database connection failed:",
                error.message
            );

            return res.status(500).json({
                success: false,
                message: "Database connection failed"
            });
        }
    },
    apiRateLimit,
    apiRouter
);


// Local development server
if (require.main === module) {
    const PORT = process.env.PORT || 4000;

    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server started on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error("Server startup failed:", error.message);
            process.exit(1);
        });
}


module.exports = app;