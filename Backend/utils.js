/**
 * Utility functions for document processing
 */

/**
 * Validate if text is a valid document
 * @param {string} text - Text to validate
 * @returns {boolean} - True if valid
 */
export const validateDocumentText = (text) => {
    if (!text || typeof text !== 'string') {
        return false
    }
    // Minimum 50 characters for meaningful summarization
    return text.trim().length >= 50
}

/**
 * Calculate compression ratio
 * @param {string} original - Original text
 * @param {string} compressed - Compressed text
 * @returns {number} - Compression ratio (0-1)
 */
export const calculateCompressionRatio = (original, compressed) => {
    return compressed.length / original.length
}

/**
 * Calculate word count
 * @param {string} text - Text to count
 * @returns {number} - Word count
 */
export const getWordCount = (text) => {
    return text.trim().split(/\s+/).length
}

/**
 * Extract sentences from text
 * @param {string} text - Text to process
 * @returns {Array<string>} - Array of sentences
 */
export const extractSentences = (text) => {
    return text.match(/[^.!?]+[.!?]+/g) || []
}

/**
 * Estimate reading time in minutes
 * @param {string} text - Text to analyze
 * @param {number} wordsPerMinute - Reading speed (default 200)
 * @returns {number} - Estimated reading time in minutes
 */
export const estimateReadingTime = (text, wordsPerMinute = 200) => {
    const wordCount = getWordCount(text)
    return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * Format document metadata
 * @param {string} text - Document text
 * @returns {Object} - Metadata object
 */
export const getDocumentMetadata = (text) => {
    return {
        wordCount: getWordCount(text),
        characterCount: text.length,
        sentenceCount: extractSentences(text).length,
        paragraphCount: text.split(/\n\n+/).length,
        estimatedReadingTime: estimateReadingTime(text),
        language: "en"
    }
}

/**
 * Format timestamp for logging
 * @returns {string} - Formatted timestamp
 */
export const getFormattedTimestamp = () => {
    return new Date().toISOString()
}

/**
 * Create a response envelope
 * @param {*} data - Response data
 * @param {boolean} success - Success status
 * @param {string} message - Response message
 * @returns {Object} - Formatted response
 */
export const createResponse = (data, success = true, message = null) => {
    return {
        success,
        timestamp: getFormattedTimestamp(),
        message,
        data
    }
}

/**
 * Create an error response
 * @param {string} error - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Object} - Formatted error response
 */
export const createErrorResponse = (error, statusCode = 400) => {
    return {
        success: false,
        timestamp: getFormattedTimestamp(),
        error: error.message || error,
        statusCode
    }
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, length = 100) => {
    if (text.length <= length) return text
    return text.substring(0, length) + "..."
}

/**
 * Clean and normalize document text
 * @param {string} text - Text to clean
 * @returns {string} - Cleaned text
 */
export const cleanDocumentText = (text) => {
    return text
        .trim()
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\n\n+/g, '\n\n') // Normalize paragraph breaks
        .replace(/[^\S\n]/g, ' ') // Remove non-space whitespace except newlines
}

export default {
    validateDocumentText,
    calculateCompressionRatio,
    getWordCount,
    extractSentences,
    estimateReadingTime,
    getDocumentMetadata,
    getFormattedTimestamp,
    createResponse,
    createErrorResponse,
    truncateText,
    cleanDocumentText
}
