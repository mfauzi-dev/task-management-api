import express from "express";
import {
    getUserProfile,
    updatePassword,
    updateProfile,
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import {
    createTask,
    deleteTask,
    deleteUserTask,
    detailTask,
    getAllTask,
    getDetailUserTask,
    getUserTask,
    updateTask,
    updateUserTask,
} from "../controllers/task.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const routes = express.Router();

routes.get("/me", authenticate, getUserProfile);
routes.patch("/me/update-password", authenticate, updatePassword);
routes.patch("/me/update-profile", authenticate, updateProfile);

routes.post("/tasks", authenticate, createTask);
routes.get("/tasks", authenticate, getUserTask);
routes.get("/tasks/:slug/detail", authenticate, getDetailUserTask);
routes.patch("/tasks/:slug/update", authenticate, updateUserTask);
routes.delete("/tasks/:slug/delete", authenticate, deleteUserTask);
routes.get("/tasks/all", authenticate, authorizeRoles("admin"), getAllTask);
routes.get(
    "/tasks/all/:slug/detail",
    authenticate,
    authorizeRoles("admin"),
    detailTask
);
routes.patch(
    "/tasks/all/:id/update",
    authenticate,
    authorizeRoles("admin"),
    updateTask
);
routes.delete(
    "/tasks/all/:id/delete",
    authenticate,
    authorizeRoles("admin"),
    deleteTask
);

export { routes };
