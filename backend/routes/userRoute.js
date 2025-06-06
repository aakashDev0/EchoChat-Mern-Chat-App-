import express from "express";
import { getOtherUsers, login, logout, register, searchUsers } from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/").get(isAuthenticated, getOtherUsers);
router.route("/search").get(isAuthenticated, searchUsers);

export default router;