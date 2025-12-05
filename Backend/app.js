import express from "express"
import path from "path"
import routes from "./routes.js"
import config from "./config.js"

/**
 * Initialize and configure Express application
 * @returns {express.Application} - Configured Express app
 */
export const createApp = () => {
    const app = express()

    // Middleware
    app.use(express.json({ limit: '10mb' })) // Increase JSON payload limit for large documents
    app.use(express.urlencoded({ limit: '10mb', extended: true }))

    // CORS Middleware
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        
        if (req.method === "OPTIONS") {
            return res.sendStatus(200)
        }
        
        next()
    })

    // Request logging middleware
    app.use((req, res, next) => {
        const startTime = Date.now()
        res.on('finish', () => {
            const duration = Date.now() - startTime
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`)
        })
        next()
    })

    // Serve frontend static files (if present)
    const frontendDir = path.join(process.cwd(), "frontend")
    app.use(express.static(frontendDir))

    // Routes
    app.use("/api", routes)

    // Root endpoint
    app.get("/", (req, res) => {
        res.json({
            message: "Document Enhancer and Generator Backend",
            version: "1.0.0",
            documentation: "/api/capabilities",
            status: "running"
        })
    })

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            error: "Route not found",
            path: req.path,
            method: req.method
        })
    })

    // Error handler
    app.use((err, req, res, next) => {
        console.error("Error:", err.message)
        res.status(err.status || 500).json({
            success: false,
            error: err.message || "Internal server error",
            timestamp: new Date().toISOString()
        })
    })

    return app
}

/**
 * Start the server
 */
export const startServer = () => {
    const app = createApp()
    const port = config.api.port
    const environment = config.api.environment

    const maxRetries = 10

    const tryListen = (candidatePort, remaining) => {
        const server = app.listen(candidatePort)

        server.on('listening', () => {
            console.log(`\nServer listening on port ${candidatePort}`)
            console.log(`\n╔════════════════════════════════════════════════════════════╗\n║   Document Enhancer and Generator Backend                  ║\n║   Version: 1.0.0                                           ║\n║   Environment: ${environment.padEnd(35)} ║\n║   Listening on: http://localhost:${candidatePort.toString().padEnd(30)} ║\n║                                                            ║\n║   API Documentation: http://localhost:${candidatePort}/api/capabilities ║\n╚════════════════════════════════════════════════════════════╝\n        `)
        })

        server.on('error', (err) => {
            console.error('Server error:', err)
            if (err && err.code === 'EADDRINUSE') {
                console.warn(`Port ${candidatePort} is in use.`)
                server.close()
                if (remaining > 0) {
                    console.log(`Trying next port ${candidatePort + 1} ... (${remaining - 1} attempts left)`)
                    tryListen(candidatePort + 1, remaining - 1)
                } else {
                    console.error('No available ports found. Exiting.')
                    process.exit(1)
                }
            } else {
                console.error('Fatal server error:', err)
                process.exit(1)
            }
        })
    }

    tryListen(port, maxRetries)

    // Global handlers to surface uncaught errors instead of silent exit
    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err)
    })

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason)
    })

    return app
}

// Start the server
startServer()

export default { createApp, startServer }
