/**
 * Configuration for the Document Enhancer and Generator Backend
 */

export const config = {
    // Groq LLM Configuration
    groq: {
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        maxTokens: 2000,
        maxRetries: 2,
    },

    // Summarization Settings
    summarization: {
        compressionRatio: 0.3, // Keep 30% of original length
        includeStructure: true,
        language: "en"
    },

    // Key Points Extraction
    keyPoints: {
        minPoints: 3,
        maxPoints: 10,
        format: "numbered"
    },

    // Executive Summary
    executiveSummary: {
        maxSentences: 4,
        focus: "business_impact",
        audience: "executive"
    },

    // Document Analysis
    analysis: {
        includeStrengths: true,
        includeWeaknesses: true,
        includeRisks: true,
        includeRecommendations: true
    },

    // API Settings
    api: {
        port: process.env.PORT || 5000,
        environment: process.env.NODE_ENV || "development",
        timeout: 30000, // 30 seconds
        corsEnabled: true
    },

    // Database Configuration (for future use)
    database: {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 27017,
        name: process.env.DB_NAME || "document_enhancer",
        url: process.env.MONGODB_URL
    },

    // Logging
    logging: {
        level: "info",
        format: "json",
        includeTimestamp: true
    }
}

export default config
