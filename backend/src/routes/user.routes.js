import { Router } from "express";
import { registerUser, loginUser, updateAvatar } from "../controllers/usercontroller.js";
import { handleOcrUpload } from "../controllers/ocrtestcontroller.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { uploadSingle } from "../middleware/multer.js";

const router = Router();

router.post("/register", uploadSingle("avatar"), registerUser);
router.post("/login", loginUser);
router.patch("/avatar", authenticate, uploadSingle("avatar"), updateAvatar);
router.post("/ocr", authenticate, uploadSingle("image"), handleOcrUpload);

export default router;
