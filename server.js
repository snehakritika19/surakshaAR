require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");

const app = express();

app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Test PostgreSQL connection
pool.connect()
    .then(() => {
        console.log("PostgreSQL connected successfully!");
    })
    .catch((error) => {
        console.error("PostgreSQL connection failed:", error.message);
    });

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "SurakshaAR backend is working!"
    });
});

// POST - Save training attempt
app.post("/api/attempts", async (req, res) => {
    const {
        workerId,
        moduleId,
        score,
        retryCount,
        criticalErrors,
        completed
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO attempts
            (worker_id, module_id, score, retry_count, critical_errors, completed)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                workerId,
                moduleId,
                score,
                retryCount,
                criticalErrors,
                completed
            ]
        );

        res.status(201).json({
            success: true,
            message: "Training attempt saved successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Database error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to save training attempt"
        });
    }
});

// GET - Fetch all training attempts
app.get("/api/attempts", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM attempts ORDER BY created_at DESC"
        );

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error("Database error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch training attempts"
        });
    }
});
// POST - Register a worker
app.post("/api/workers", async (req, res) => {
    const {
        workerId,
        name,
        site,
        language
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO workers
            (worker_id, name, site, language)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                workerId,
                name,
                site,
                language
            ]
        );

        res.status(201).json({
            success: true,
            message: "Worker registered successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Database error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to register worker"
        });
    }
});
// GET - Fetch all workers
app.get("/api/workers", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM workers ORDER BY created_at DESC"
        );

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error("Database error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch workers"
        });
    }
});
// GET - Fetch all training modules
app.get("/api/modules", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM modules ORDER BY created_at DESC"
        );

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error("Database error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch training modules"
        });
    }
});
// GET - Dashboard summary
app.get("/api/dashboard", async (req, res) => {
    try {
        const workersResult = await pool.query(
            "SELECT COUNT(*) FROM workers"
        );

        const attemptsResult = await pool.query(
            "SELECT COUNT(*) FROM attempts"
        );

        const completedResult = await pool.query(
            "SELECT COUNT(*) FROM attempts WHERE completed = true"
        );

        const scoreResult = await pool.query(
            "SELECT COALESCE(AVG(score), 0) FROM attempts"
        );

        res.json({
            success: true,
            data: {
                totalWorkers: Number(workersResult.rows[0].count),
                totalAttempts: Number(attemptsResult.rows[0].count),
                completedAttempts: Number(completedResult.rows[0].count),
                averageScore: Number(scoreResult.rows[0].coalesce)
            }
        });

    } catch (error) {
        console.error("Database error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data"
        });
    }
});
// Start server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});