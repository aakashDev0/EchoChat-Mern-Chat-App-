import express from "express";
import { getMessage, sendMessage, deleteMessage } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import fileUpload from "../middleware/fileUpload.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated, fileUpload.single('file'), sendMessage);
router.route("/:id").get(isAuthenticated, getMessage);
router.route("/delete/:messageId").delete(isAuthenticated, deleteMessage);

export default router;