import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.3,
  maxTokens: 500,
  maxRetries: 2,
});

/**
 * Classifies a document into predefined categories
 * @param {string} documentText - The full text of the document to classify
 * @returns {Promise<{documentType: string, confidence: number}>} - Classification result
 */
export const classifyDocument = async (documentText) => {
  const systemPrompt = `You are an expert document classifier. Your task is to analyze the provided document text and classify it into ONE of the following categories:

- Contract
- Invoice
- Report
- Letter
- Resume
- Legal Document
- Technical Documentation
- Presentation
- Spreadsheet
- Form
- Other

Analyze the structure, content, terminology, and format of the document to determine its type.

IMPORTANT: Respond ONLY with a JSON object in this exact format:
{
  "documentType": "Category Name",
  "confidence": 0.95,
  "reasoning": "Brief explanation"
}

The confidence should be a number between 0 and 1.`;

  const userPrompt = `Classify the following document:

${documentText.substring(0, 3000)}

Respond with JSON only.`;

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
    ]);

    // Parse the JSON response
    const content = response.content.trim();
    
    // Extract JSON from markdown code blocks if present
    let jsonStr = content;
    if (content.includes("```json")) {
      jsonStr = content.split("```json")[1].split("```")[0].trim();
    } else if (content.includes("```")) {
      jsonStr = content.split("```")[1].split("```")[0].trim();
    }

    const result = JSON.parse(jsonStr);

    return {
      documentType: result.documentType || "Other",
      confidence: result.confidence || 0.5,
      reasoning: result.reasoning || "",
    };
  } catch (error) {
    console.error("Error classifying document:", error);
    return {
      documentType: "Other",
      confidence: 0,
      reasoning: "Classification failed",
    };
  }
};

/**
 * Batch classify multiple documents
 * @param {Array<{id: string, text: string}>} documents - Array of documents to classify
 * @returns {Promise<Array<{id: string, documentType: string, confidence: number}>>}
 */
export const batchClassifyDocuments = async (documents) => {
  const classifications = await Promise.all(
    documents.map(async (doc) => {
      const result = await classifyDocument(doc.text);
      return {
        id: doc.id,
        ...result,
      };
    })
  );

  return classifications;
};
