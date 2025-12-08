import { summarizeDocument, extractKeyPoints, generateExecutiveSummary, analyzeDocument } from "./documentSummariserService.js"

/**
 * API service for document enhancement and generation
 * Provides wrapper functions for all summarization capabilities
 */

export class DocumentEnhancerService {
    /**
     * Process a document with all available summarization methods
     * @param {string} documentText - The document content to process
     * @returns {Promise<Object>} - Object containing all generated summaries and analyses
     */
    static async processFullDocument(documentText) {
        try {
            console.log("Processing document with all enhancement methods...")
            
            const [summary, keyPoints, executiveSummary, analysis] = await Promise.all([
                summarizeDocument(documentText),
                extractKeyPoints(documentText),
                generateExecutiveSummary(documentText),
                analyzeDocument(documentText)
            ])

            return {
                success: true,
                timestamp: new Date().toISOString(),
                results: {
                    summary,
                    keyPoints,
                    executiveSummary,
                    analysis
                }
            }
        } catch (error) {
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            }
        }
    }

    /**
     * Quick summary of a document
     * @param {string} documentText - The document content
     * @returns {Promise<Object>} - Summary result
     */
    static async quickSummary(documentText) {
        try {
            const result = await summarizeDocument(documentText)
            return {
                success: true,
                data: result,
                type: "summary"
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            }
        }
    }

    /**
     * Get executive-level overview
     * @param {string} documentText - The document content
     * @returns {Promise<Object>} - Executive summary result
     */
    static async getExecutiveOverview(documentText) {
        try {
            const result = await generateExecutiveSummary(documentText)
            return {
                success: true,
                data: result,
                type: "executiveSummary"
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            }
        }
    }

    /**
     * Extract actionable key points
     * @param {string} documentText - The document content
     * @returns {Promise<Object>} - Key points result
     */
    static async getKeyInsights(documentText) {
        try {
            const result = await extractKeyPoints(documentText)
            return {
                success: true,
                data: result,
                type: "keyPoints"
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            }
        }
    }

    /**
     * Get detailed document analysis
     * @param {string} documentText - The document content
     * @returns {Promise<Object>} - Analysis result
     */
    static async getDetailedAnalysis(documentText) {
        try {
            const result = await analyzeDocument(documentText)
            return {
                success: true,
                data: result,
                type: "analysis"
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            }
        }
    }
}

export default DocumentEnhancerService