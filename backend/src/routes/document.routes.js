import { Router } from "express";
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  searchDocumentsHandler,
  getDocumentHistory,
  deleteDocument,
} from "../controllers/documentController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { uploadSingle } from "../middleware/multer.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Document routes
router.post("/upload", uploadSingle("document"), uploadDocument);
router.get("/", getDocuments);
router.get("/search", searchDocumentsHandler);
router.get("/history", getDocumentHistory);
router.get("/:id", getDocumentById);
router.delete("/:id", deleteDocument);

export default router;
