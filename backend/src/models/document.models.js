import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const documentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    cloudinaryUrl: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    // Extracted text content
    rawText: {
      type: String,
      default: "",
      index: "text", // Enable full-text search
    },
    maskedText: {
      type: String,
      default: "",
    },
    // AI-generated summaries
    summary: {
      type: String,
      default: "",
    },
    executiveSummary: {
      type: String,
      default: "",
    },
    keyPoints: {
      type: String,
      default: "",
    },
    analysis: {
      type: String,
      default: "",
    },
    // Document classification
    documentType: {
      type: String,
      enum: [
        "Contract",
        "Invoice",
        "Report",
        "Letter",
        "Resume",
        "Legal Document",
        "Technical Documentation",
        "Presentation",
        "Spreadsheet",
        "Form",
        "Other",
      ],
      default: "Other",
    },
    classificationConfidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    // Sensitive data flags
    hasSensitiveData: {
      type: Boolean,
      default: false,
    },
    maskedFields: {
      type: [String],
      default: [],
    },
    // Processing status
    processingStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    processingError: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search
documentSchema.index({ rawText: "text", originalName: "text", summary: "text" });

// Add pagination plugin
documentSchema.plugin(mongooseAggregatePaginate);

export const Document = mongoose.model("Document", documentSchema);
