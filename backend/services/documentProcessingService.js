import axios from "axios";
import FormData from "form-data";
import { uploadOnCloudinary } from "../src/utils/cloudinary.js";
import { summarizeDocument, extractKeyPoints, generateExecutiveSummary, analyzeDocument } from "./documentSummariserService.js";
import { classifyDocument } from "./documentClassificationService.js";
import { processDocumentForSensitiveData } from "./sensitiveDataMaskingService.js";
import { Document } from "../src/models/document.models.js";
import fs from "fs";
import mammoth from "mammoth";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const OCR_API_URL = "https://api.ocr.space/parse/image";

/**
 * Extract text from PDF file using pdfreader
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromPDF = async (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const { PdfReader } = require('pdfreader');
      const reader = new PdfReader();
      let fullText = "";
      
      reader.parseFileItems(filePath, (err, item) => {
        if (err) {
          reject(err);
        } else if (!item) {
          // End of file
          resolve(fullText.trim());
        } else if (item.text) {
          // Add text with space
          fullText += item.text + " ";
        }
      });
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      reject(error);
    }
  });
};

/**
 * Extract text from DOCX file
 * @param {string} filePath - Path to DOCX file
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error("Error extracting text from DOCX:", error);
    throw error;
  }
};

/**
 * Extract text from image using OCR
 * @param {string} imageUrl - Cloudinary URL of the image
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromImage = async (imageUrl) => {
  const apiKey = process.env.OCR_SPACE_API_KEY;

  if (!apiKey) {
    throw new Error("OCR_SPACE_API_KEY is not configured");
  }

  const form = new FormData();
  form.append("apikey", apiKey);
  form.append("language", process.env.OCR_LANGUAGE || "eng");
  form.append("isOverlayRequired", "false");
  form.append("detectOrientation", "true");
  form.append("url", imageUrl);

  try {
    const { data } = await axios.post(OCR_API_URL, form, {
      headers: form.getHeaders(),
      timeout: 120000,
    });

    if (data?.IsErroredOnProcessing) {
      throw new Error(data?.ErrorMessage || data?.ErrorDetails || "OCR processing failed");
    }

    const text = (data?.ParsedResults || [])
      .map((result) => result?.ParsedText || "")
      .join("\n")
      .trim();

    return text;
  } catch (error) {
    console.error("Error extracting text from image:", error);
    throw error;
  }
};

/**
 * Extract text based on file type
 * @param {string} filePath - Local file path
 * @param {string} cloudinaryUrl - Cloudinary URL (for images)
 * @param {string} mimeType - File MIME type
 * @returns {Promise<string>} - Extracted text
 */
const extractText = async (filePath, cloudinaryUrl, mimeType) => {
  if (mimeType === "application/pdf") {
    return await extractTextFromPDF(filePath);
  } else if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    return await extractTextFromDOCX(filePath);
  } else if (mimeType.startsWith("image/")) {
    return await extractTextFromImage(cloudinaryUrl);
  } else if (mimeType === "text/plain") {
    return fs.readFileSync(filePath, "utf-8");
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
};

/**
 * Process a document through the complete pipeline
 * @param {Object} fileData - File data from multer
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Processed document
 */
export const processDocument = async (fileData, userId) => {
  const { path: localFilePath, originalname, mimetype, size } = fileData;
  let document; // Declare outside try block so it's accessible in catch

  try {
    // Step 1: Extract text FIRST (before uploading to Cloudinary which deletes the file)
    console.log("Extracting text...");
    let rawText = "";
    
    // For images, we'll need the Cloudinary URL for OCR, so upload first
    if (mimetype.startsWith("image/")) {
      console.log("Uploading image to Cloudinary for OCR...");
      const uploadResult = await uploadOnCloudinary(localFilePath);
      
      if (!uploadResult || (!uploadResult.secure_url && !uploadResult.url)) {
        throw new Error("Failed to upload image to Cloudinary");
      }
      
      const cloudinaryUrl = uploadResult.secure_url || uploadResult.url;
      rawText = await extractTextFromImage(cloudinaryUrl);
      
      // Create document record with image
      document = new Document({
        userId,
        filename: uploadResult.original_filename || originalname,
        originalName: originalname,
        mimeType: mimetype,
        size,
        cloudinaryUrl,
        cloudinaryPublicId: uploadResult.public_id,
        processingStatus: "processing",
      });
    } else {
      // For PDFs and DOCX, extract text first
      if (mimetype === "application/pdf") {
        rawText = await extractTextFromPDF(localFilePath);
      } else if (
        mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        mimetype === "application/msword"
      ) {
        rawText = await extractTextFromDOCX(localFilePath);
      } else if (mimetype === "text/plain") {
        rawText = fs.readFileSync(localFilePath, "utf-8");
      } else {
        throw new Error(`Unsupported file type: ${mimetype}`);
      }
      
      // Now upload to Cloudinary
      console.log("Uploading to Cloudinary...");
      const uploadResult = await uploadOnCloudinary(localFilePath);

      if (!uploadResult || (!uploadResult.secure_url && !uploadResult.url)) {
        throw new Error("Failed to upload file to Cloudinary");
      }

      const cloudinaryUrl = uploadResult.secure_url || uploadResult.url;
      const cloudinaryPublicId = uploadResult.public_id;

      // Create document record
      document = new Document({
        userId,
        filename: uploadResult.original_filename || originalname,
        originalName: originalname,
        mimeType: mimetype,
        size,
        cloudinaryUrl,
        cloudinaryPublicId,
        processingStatus: "processing",
      });
    }

    await document.save();

    if (!rawText || rawText.trim().length === 0) {
      document.processingStatus = "failed";
      document.processingError = "No text could be extracted from the document";
      await document.save();
      return document;
    }

    document.rawText = rawText;

    // Step 3: Mask sensitive data
    console.log("Masking sensitive data...");
    const maskingResult = await processDocumentForSensitiveData(rawText);
    document.maskedText = maskingResult.maskedText;
    document.hasSensitiveData = maskingResult.hasSensitiveData;
    document.maskedFields = maskingResult.maskedFields;

    // Step 4: Generate summaries (in parallel)
    console.log("Generating summaries...");
    const [summary, executiveSummary, keyPoints, analysis] = await Promise.all([
      summarizeDocument(rawText),
      generateExecutiveSummary(rawText),
      extractKeyPoints(rawText),
      analyzeDocument(rawText),
    ]);

    document.summary = summary;
    document.executiveSummary = executiveSummary;
    document.keyPoints = keyPoints;
    document.analysis = analysis;

    // Step 5: Classify document
    console.log("Classifying document...");
    const classification = await classifyDocument(rawText);
    document.documentType = classification.documentType;
    document.classificationConfidence = classification.confidence;

    // Mark as completed
    document.processingStatus = "completed";
    await document.save();

    console.log("Document processing completed successfully");
    return document;
  } catch (error) {
    console.error("Error processing document:", error);

    // Update document with error if it exists
    if (document && document._id) {
      document.processingStatus = "failed";
      document.processingError = error.message;
      await document.save();
    }

    throw error;
  }
};

/**
 * Search documents by text query
 * @param {string} userId - User ID
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @param {number} limit - Results per page
 * @returns {Promise<Object>} - Search results
 */
export const searchDocuments = async (userId, query, page = 1, limit = 10) => {
  try {
    const documents = await Document.find({
      userId,
      $text: { $search: query },
    })
      .sort({ score: { $meta: "textScore" } })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-rawText -maskedText -analysis");

    const total = await Document.countDocuments({
      userId,
      $text: { $search: query },
    });

    return {
      documents,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error searching documents:", error);
    throw error;
  }
};
