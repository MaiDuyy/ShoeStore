// app/routes/user.routes.js
import express from "express";
import * as controller from "../controllers/user.controller.js";
import { authJwt } from "../middlewares/index.js";

const router = express.Router();

// Public route
router.get("/all", controller.allAccess);

// User route (any authenticated user)
router.get("/user", [authJwt.verifyToken], controller.userBoard);

// Moderator route
router.get("/mod", [authJwt.verifyToken, authJwt.isModerator], controller.moderatorBoard);

// Admin route
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);

// Profile routes
router.get("/profile", [authJwt.verifyToken], controller.getProfile);
router.put("/profile", [authJwt.verifyToken], controller.updateProfile);
router.put("/profile/avatar", [authJwt.verifyToken], controller.updateAvatar);

export default router;