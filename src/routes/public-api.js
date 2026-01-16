import express from "express";
import {
    login,
    refreshToken,
    register,
} from "../controllers/auth.controller.js";

const publicRoutes = express.Router();

publicRoutes.post("/register", register);
publicRoutes.post("/login", login);
publicRoutes.post("/refresh-token", refreshToken);

export { publicRoutes };
