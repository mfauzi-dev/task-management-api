import { logger } from "../config/logger.js";
import { ResponseError } from "../middleware/error.middleware.js";
import Role from "../models/Role.js";
import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/generateToken.js";
import {
    loginValidation,
    registerValidation,
} from "../validations/auth.validation.js";
import { validated } from "../validations/validation.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const request = validated(registerValidation, req.body);

        const role = await Role.findOne({
            where: {
                name: "member",
            },
        });

        const userAlreadyExists = await User.findOne({
            where: {
                email: request.email,
            },
        });

        if (userAlreadyExists) {
            throw new ResponseError(400, "User sudah ada");
        }

        if (request.password !== request.confirmPassword) {
            throw new ResponseError(
                400,
                "Password dan Konfirmasi Password tidak sama"
            );
        }

        const hashedPassword = await hashPassword(request.password);

        const result = await User.create({
            email: request.email,
            password: hashedPassword,
            name: request.name,
            roleId: role.id,
        });

        const { password: undefined, ...userWithoutPassword } = result.toJSON();

        logger.info(`Registrasi Berhasil`);
        return res.status(201).json({
            success: true,
            message: "Registrasi Berhasil",
            data: userWithoutPassword,
        });
    } catch (error) {
        logger.error("User registration failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
            data: null,
        });
    }
};

export const login = async (req, res) => {
    try {
        const request = validated(loginValidation, req.body);

        const user = await User.findOne({
            where: {
                email: request.email,
            },
            include: [
                {
                    model: Role,
                    as: "role",
                },
            ],
        });

        if (!user) {
            throw new ResponseError(400, "Email dan Password salah");
        }

        const isPasswordValid = await comparePassword(
            request.password,
            user.password
        );

        if (!isPasswordValid) {
            throw new ResponseError(400, "Email dan Password salah");
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.lastLogin = new Date();
        user.save();

        const { password, ...userWithoutPassword } = user.toJSON();

        logger.info("Logged in successfully");
        res.status(200).json({
            success: true,
            message: "Login Berhasil",
            data: userWithoutPassword,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        logger.error("User registration failed", error);
        res.status(400).json({
            success: false,
            message: error.message,
            data: null,
        });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Refresh token required",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const user = await User.findOne({
            where: {
                id: decoded.id,
            },
            include: [
                {
                    model: Role,
                    as: "role",
                },
            ],
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return res.status(200).json({
            success: true,
            message: "Token refreshed",
            accessToken,
            refreshToken,
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token",
        });
    }
};
