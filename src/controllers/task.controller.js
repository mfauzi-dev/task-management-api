import { logger } from "../config/logger.js";
import { ResponseError } from "../middleware/error.middleware.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import {
    createTaskValidation,
    updateTaskValidation,
} from "../validations/task.validation.js";
import { validated } from "../validations/validation.js";
import slugify from "slugify";
import crypto from "crypto";
import sequelize from "../config/database.js";

export const getAllTask = async (req, res) => {
    try {
        const { search = "", status = "", page = 1, perPage = 10 } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(perPage);

        const limit = parseInt(perPage);

        const searchQuery = `%${search || ""}%`;

        const data = await sequelize.query(
            `
            SELECT t.id, t.userId, t.title, t.slug, t.description, t.status, t.createdAt
            FROM tasks t
            WHERE (t.title LIKE :searchQuery OR t.description LIKE :searchQuery)
                AND (:status = '' OR t.status = :status)
            ORDER By t.createdAt ASC
            LIMIT :limit OFFSET :offset
            `,
            {
                replacements: {
                    status,
                    searchQuery,
                    limit,
                    offset,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const [countResult] = await sequelize.query(
            `
            SELECT COUNT(*) AS total
            FROM tasks t
            WHERE (t.title LIKE :searchQuery OR t.description LIKE :searchQuery)
                AND (:status = '' OR t.status = :status)
            `,
            {
                replacements: {
                    status,
                    searchQuery,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const total = Number(countResult.total || 0);

        logger.info("Get all task successfully");
        return res.status(200).json({
            success: true,
            message: "Semua task berhasil didapatkan.",
            currentPage: parseInt(page),
            perPage: limit,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data,
        });
    } catch (error) {
        logger.error("Get all task failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getUserTask = async (req, res) => {
    try {
        const userId = req.user.id;

        const { search = "", status = "", page = 1, perPage = 10 } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(perPage);

        const limit = parseInt(perPage);

        const searchQuery = `%${search || ""}%`;

        const data = await sequelize.query(
            `
            SELECT t.id, t.userId, t.title, t.slug, t.description, t.status, t.createdAt
            FROM tasks t
            WHERE t.userId = :userId
                AND (t.title LIKE :searchQuery OR t.description LIKE :searchQuery)
                AND (:status = '' OR t.status = :status)
            ORDER By t.createdAt ASC
            LIMIT :limit OFFSET :offset
            `,
            {
                replacements: {
                    status,
                    searchQuery,
                    userId,
                    limit,
                    offset,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const [countResult] = await sequelize.query(
            `
            SELECT COUNT(*) AS total
            FROM tasks t
            WHERE t.userId = :userId
                AND (t.title LIKE :searchQuery OR t.description LIKE :searchQuery)
                AND (:status = '' OR t.status = :status)
            `,
            {
                replacements: {
                    status,
                    userId,
                    searchQuery,
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        const total = Number(countResult.total || 0);

        logger.info("Get all task successfully");
        return res.status(200).json({
            success: true,
            message: "Semua task berhasil didapatkan.",
            currentPage: parseInt(page),
            perPage: limit,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data,
        });
    } catch (error) {
        logger.error("Get all task failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const createTask = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findOne({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new ResponseError(404, "User tidak ditemukan");
        }

        const request = validated(createTaskValidation, req.body);

        const randomSuffix = crypto.randomBytes(2).toString("hex");

        const slug = slugify(request.title, {
            lower: true,
            strict: true,
            trim: true,
        });

        const result = await Task.create({
            userId: user.id,
            title: request.title,
            slug: slug + "-" + randomSuffix,
            description: request.description,
            status: request.status,
        });

        logger.info("create task success");
        res.status(200).json({
            success: true,
            message: "Task berhasil ditambahkan",
            data: result,
        });
    } catch (error) {
        logger.error("Failed to create task", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const detailTask = async (req, res) => {
    try {
        const { slug } = req.params;

        const task = await Task.findOne({
            where: {
                slug: slug,
            },
            include: [
                {
                    model: User,
                    as: "owner",
                    attributes: ["id", "name"],
                },
            ],
        });

        if (!task) {
            throw new ResponseError(404, "Task tidak ditemukan");
        }

        logger.info("get detail task success");
        res.status(200).json({
            success: true,
            message: "Detail Task berhasil didapatkan",
            data: task,
        });
    } catch (error) {
        logger.error("Failed to create task", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getDetailUserTask = async (req, res) => {
    try {
        const userId = req.user.id;

        const { slug } = req.params;

        const task = await Task.findOne({
            where: {
                slug: slug,
                userId: userId,
            },
            include: [
                {
                    model: User,
                    as: "owner",
                    attributes: ["id", "name"],
                },
            ],
        });

        if (!task) {
            throw new ResponseError(404, "Task tidak ditemukan");
        }

        logger.info("get detail task success");
        res.status(200).json({
            success: true,
            message: "Detail Task User berhasil didapatkan",
            data: task,
        });
    } catch (error) {
        logger.error("Failed to create task", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const request = validated(updateTaskValidation, req.body);

        const task = await Task.findOne({
            where: {
                id: id,
            },
        });

        if (!task) {
            throw new ResponseError(404, "Task tidak ditemukan");
        }

        if (request.title) {
            const randomSuffix = crypto.randomBytes(2).toString("hex");

            const slug = slugify(request.title, {
                lower: true,
                strict: true,
                trim: true,
            });

            task.slug = `${slug}-${randomSuffix}`;
        }

        task.title = request.title ?? task.title;
        task.description = request.description ?? task.description;
        task.status = request.status ?? task.status;

        await task.save();

        logger.info("Update task successfully");
        res.status(200).json({
            success: true,
            message: "Task berhasil diupdate",
            data: task,
        });
    } catch (error) {
        logger.error("Update task failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateUserTask = async (req, res) => {
    try {
        const { slug } = req.params;
        const userId = req.user.id;
        const request = validated(updateTaskValidation, req.body);

        const task = await Task.findOne({
            where: {
                slug: slug,
                userId: userId,
            },
        });

        if (!task) {
            throw new ResponseError(404, "Task tidak ditemukan");
        }

        if (request.title) {
            const randomSuffix = crypto.randomBytes(2).toString("hex");

            const slug = slugify(request.title, {
                lower: true,
                strict: true,
                trim: true,
            });

            task.slug = `${slug}-${randomSuffix}`;
        }

        task.title = request.title ?? task.title;
        task.description = request.description ?? task.description;
        task.status = request.status ?? task.status;

        await task.save();

        logger.info("Update task successfully");
        res.status(200).json({
            success: true,
            message: "Task berhasil diupdate",
            data: task,
        });
    } catch (error) {
        logger.error("Update task failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOne({
            where: {
                id: id,
            },
        });

        if (!task) {
            throw new ResponseError(404, "Task tidak ditemukan");
        }

        await task.destroy();

        logger.info("Delete task successfully");
        res.status(200).json({
            success: true,
            message: "Task berhasil dihapus",
            data: task,
        });
    } catch (error) {
        logger.error("Delete task failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteUserTask = async (req, res) => {
    try {
        const { slug } = req.params;
        const userId = req.user.id;

        const task = await Task.findOne({
            where: {
                slug: slug,
                userId: userId,
            },
        });

        if (!task) {
            throw new ResponseError(404, "Task tidak ditemukan");
        }

        await task.destroy();

        logger.info("Delete task successfully");
        res.status(200).json({
            success: true,
            message: "Task berhasil dihapus",
            data: task,
        });
    } catch (error) {
        logger.error("Delete task failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
