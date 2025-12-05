import express from "express"
import DocumentEnhancerService from "./documentEnhancerService.js"
import { validateDocumentText, createResponse, createErrorResponse, getDocumentMetadata, cleanDocumentText } from "./utils.js"

const router = express.Router()

/**
 * @route POST /api/summarize
 * @desc Generate a comprehensive summary of a document
 */
router.post("/summarize", async (req, res) => {
    try {
        const { document } = req.body

        // Validation
        if (!document) {
            return res.status(400).json(createErrorResponse("Document text is required", 400))
        }

        if (!validateDocumentText(document)) {
            return res.status(400).json(createErrorResponse("Document must contain at least 50 characters", 400))
        }

        const cleanedDocument = cleanDocumentText(document)
        const metadata = getDocumentMetadata(cleanedDocument)
        const result = await DocumentEnhancerService.quickSummary(cleanedDocument)

        if (!result.success) {
            return res.status(500).json(createErrorResponse(result.error, 500))
        }

        res.json(createResponse({
            summary: result.data,
            metadata
        }, true, "Document summarized successfully"))

    } catch (error) {
        res.status(500).json(createErrorResponse(error.message, 500))
    }
})

/**
 * @route POST /api/executive-summary
 * @desc Generate an executive summary for quick understanding
 */
router.post("/executive-summary", async (req, res) => {
    try {
        const { document } = req.body

        if (!document || !validateDocumentText(document)) {
            return res.status(400).json(createErrorResponse("Valid document text is required", 400))
        }

        const cleanedDocument = cleanDocumentText(document)
        const result = await DocumentEnhancerService.getExecutiveOverview(cleanedDocument)

        if (!result.success) {
            return res.status(500).json(createErrorResponse(result.error, 500))
        }

        res.json(createResponse({
            executiveSummary: result.data
        }, true, "Executive summary generated successfully"))

    } catch (error) {
        res.status(500).json(createErrorResponse(error.message, 500))
    }
})

/**
 * @route POST /api/key-points
 * @desc Extract key points and main ideas from a document
 */
router.post("/key-points", async (req, res) => {
    try {
        const { document } = req.body

        if (!document || !validateDocumentText(document)) {
            return res.status(400).json(createErrorResponse("Valid document text is required", 400))
        }

        const cleanedDocument = cleanDocumentText(document)
        const result = await DocumentEnhancerService.getKeyInsights(cleanedDocument)

        if (!result.success) {
            return res.status(500).json(createErrorResponse(result.error, 500))
        }

        res.json(createResponse({
            keyPoints: result.data
        }, true, "Key points extracted successfully"))

    } catch (error) {
        res.status(500).json(createErrorResponse(error.message, 500))
    }
})

/**
 * @route POST /api/analyze
 * @desc Get detailed analysis of a document including strengths, weaknesses, and recommendations
 */
router.post("/analyze", async (req, res) => {
    try {
        const { document } = req.body

        if (!document || !validateDocumentText(document)) {
            return res.status(400).json(createErrorResponse("Valid document text is required", 400))
        }

        const cleanedDocument = cleanDocumentText(document)
        const result = await DocumentEnhancerService.getDetailedAnalysis(cleanedDocument)

        if (!result.success) {
            return res.status(500).json(createErrorResponse(result.error, 500))
        }

        res.json(createResponse({
            analysis: result.data
        }, true, "Document analysis completed successfully"))

    } catch (error) {
        res.status(500).json(createErrorResponse(error.message, 500))
    }
})

/**
 * @route POST /api/process-full
 * @desc Process document with all available enhancement methods
 */
router.post("/process-full", async (req, res) => {
    try {
        const { document } = req.body

        if (!document || !validateDocumentText(document)) {
            return res.status(400).json(createErrorResponse("Valid document text is required", 400))
        }

        const cleanedDocument = cleanDocumentText(document)
        const metadata = getDocumentMetadata(cleanedDocument)
        const result = await DocumentEnhancerService.processFullDocument(cleanedDocument)

        if (!result.success) {
            return res.status(500).json(createErrorResponse(result.error, 500))
        }

        res.json(createResponse({
            ...result.results,
            metadata
        }, true, "Full document processing completed successfully"))

    } catch (error) {
        res.status(500).json(createErrorResponse(error.message, 500))
    }
})

/**
 * @route GET /api/health
 * @desc Health check endpoint
 */
router.get("/health", (req, res) => {
    res.json(createResponse({
        status: "healthy",
        service: "Document Enhancer API",
        version: "1.0.0"
    }, true, "Service is running"))
})

/**
 * @route GET /api/capabilities
 * @desc List available API capabilities
 */
router.get("/capabilities", (req, res) => {
    const capabilities = {
        endpoints: [
            {
                method: "POST",
                path: "/summarize",
                description: "Generate comprehensive summary of document"
            },
            {
                method: "POST",
                path: "/executive-summary",
                description: "Generate executive summary for quick understanding"
            },
            {
                method: "POST",
                path: "/key-points",
                description: "Extract key points and main ideas"
            },
            {
                method: "POST",
                path: "/analyze",
                description: "Get detailed analysis with strengths, weaknesses, and recommendations"
            },
            {
                method: "POST",
                path: "/process-full",
                description: "Process document with all enhancement methods"
            },
            {
                method: "GET",
                path: "/health",
                description: "Health check endpoint"
            },
            {
                method: "GET",
                path: "/capabilities",
                description: "List available capabilities"
            }
        ],
        requestFormat: {
            contentType: "application/json",
            bodyExample: {
                document: "Your document text here..."
            }
        },
        responseFormat: {
            success: true,
            timestamp: "ISO 8601 timestamp",
            message: "Operation description",
            data: "Response-specific data"
        }
    }

    res.json(createResponse(capabilities, true, "API capabilities"))
})

export default router
