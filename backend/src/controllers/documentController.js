import { processDocument, searchDocuments } from "../../services/documentProcessingService.js";
import { Document } from "../models/document.models.js";

/**
 * Upload and process a document
 * POST /api/v1/documents/upload
 */
export const uploadDocument = async (req, res) => {
  const file = req.file;
  const userId = req.user._id;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  try {
    console.log("Starting document processing for:", file.originalname);
    const document = await processDocument(file, userId);
    console.log("Document processing completed:", document._id);

    return res.status(201).json({
      success: true,
      message: "Document uploaded and processed successfully",
      data: document,
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Failed to process document",
      error: error.message,
    });
  }
};

/**
 * Get all documents for the current user
 * GET /api/v1/documents
 */
export const getDocuments = async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const documents = await Document.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-rawText -maskedText -analysis");

    const total = await Document.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      data: {
        documents,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
      error: error.message,
    });
  }
};

/**
 * Get a single document by ID
 * GET /api/v1/documents/:id
 */
export const getDocumentById = async (req, res) => {
  const userId = req.user._id;
  const documentId = req.params.id;

  try {
    const document = await Document.findOne({
      _id: documentId,
      userId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch document",
      error: error.message,
    });
  }
};

/**
 * Search documents
 * GET /api/v1/documents/search?q=query
 */
export const searchDocumentsHandler = async (req, res) => {
  const userId = req.user._id;
  const query = req.query.q;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  try {
    const results = await searchDocuments(userId, query, page, limit);

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error searching documents:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search documents",
      error: error.message,
    });
  }
};

/**
 * Get document history (recent summaries)
 * GET /api/v1/documents/history
 */
export const getDocumentHistory = async (req, res) => {
  const userId = req.user._id;
  const limit = parseInt(req.query.limit) || 20;

  try {
    const documents = await Document.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("originalName documentType executiveSummary createdAt processingStatus");

    return res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error("Error fetching document history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch document history",
      error: error.message,
    });
  }
};

/**
 * Delete a document
 * DELETE /api/v1/documents/:id
 */
export const deleteDocument = async (req, res) => {
  const userId = req.user._id;
  const documentId = req.params.id;

  try {
    const document = await Document.findOneAndDelete({
      _id: documentId,
      userId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete document",
      error: error.message,
    });
  }
};
