import { ChatGroq } from "@langchain/groq"
import dotenv from "dotenv";
dotenv.config()

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const llm = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: 0.5,
    maxTokens: 2000,
    maxRetries: 2,
})

/**
 * Summarizes a document to a concise overview
 * @param {string} documentText - The full text of the document to summarize
 * @returns {Promise<string>} - The summarized content
 */
export const summarizeDocument = async (documentText) => {
    const systemPrompt = `You are an expert document summarizer. Your task is to:
1. Read and understand the provided document text
2. Extract the main themes, key points, and important information
3. Create a concise summary that captures the essence of the document
4. Organize the summary in a clear, structured format

Guidelines:
- Keep the summary to 30% of the original length
- Use clear, professional language
- Maintain objectivity and accuracy
- Highlight the most important information first`

    const userPrompt = `Please summarize the following document:

${documentText}

Provide a well-structured summary with:
1. **Overview**: What is the document about?
2. **Key Points**: Main ideas and findings
3. **Important Details**: Critical information
4. **Conclusion**: Final takeaway or recommendation`

    try {
        const response = await llm.invoke([
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: userPrompt,
            },
        ])
        return response.content
    } catch (error) {
        console.error("Error summarizing document:", error)
        throw error
    }
}

/**
 * Extracts key points from a document
 * @param {string} documentText - The full text of the document
 * @returns {Promise<string>} - Key points extracted from the document
 */
export const extractKeyPoints = async (documentText) => {
    const systemPrompt = `You are an expert at identifying and extracting key points from documents. 
Extract the most important, actionable insights that readers should know.
Present them as a numbered list with brief explanations.`

    const userPrompt = `Extract the key points from this document:

${documentText}

Format as a numbered list with each point clearly explained.`

    try {
        const response = await llm.invoke([
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: userPrompt,
            },
        ])
        return response.content
    } catch (error) {
        console.error("Error extracting key points:", error)
        throw error
    }
}

/**
 * Generates an executive summary (brief, high-level overview)
 * @param {string} documentText - The full text of the document
 * @returns {Promise<string>} - Executive summary
 */
export const generateExecutiveSummary = async (documentText) => {
    const systemPrompt = `You are an executive summary writer. Create a brief, high-level overview suitable for busy executives.
- Maximum 3-4 sentences
- Focus on business impact and decisions needed
- Use professional language
- Highlight only the most critical information`

    const userPrompt = `Generate a brief executive summary for this document:

${documentText}`

    try {
        const response = await llm.invoke([
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: userPrompt,
            },
        ])
        return response.content
    } catch (error) {
        console.error("Error generating executive summary:", error)
        throw error
    }
}

/**
 * Creates a detailed analysis with sections
 * @param {string} documentText - The full text of the document
 * @returns {Promise<string>} - Detailed analysis
 */
export const analyzeDocument = async (documentText) => {
    const systemPrompt = `You are a professional document analyst. Provide a comprehensive analysis that includes:
- Content analysis
- Strengths and weaknesses
- Risk assessment (if applicable)
- Recommendations for action

Be thorough but concise.`

    const userPrompt = `Analyze the following document in detail:

${documentText}

Provide analysis covering: content assessment, strengths, weaknesses, and actionable recommendations.`

    try {
        const response = await llm.invoke([
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: userPrompt,
            },
        ])
        return response.content
    } catch (error) {
        console.error("Error analyzing document:", error)
        throw error
    }
}
