import { logger } from "../config/logger.js";
import { ResponseError } from "../middleware/error.middleware.js";
import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import {
    updatePasswordValidation,
    updateProfileValidation,
} from "../validations/user.validation.js";
import { validated } from "../validations/validation.js";

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findOne({
            where: {
                id: userId,
            },
        });

        const { password, ...userWithoutPassword } = user.toJSON();

        logger.info("Get user profile successfully");
        return res.status(200).json({
            success: true,
            message: "User Profile Berhasil Didapatkan",
            data: userWithoutPassword,
        });
    } catch (error) {
        logger.error("Failed to get user profile", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const request = validated(updatePasswordValidation, req.body);

        if (request.newPassword !== request.confirmPassword) {
            throw new ResponseError(
                404,
                "Password baru dan konfirmasi password tidak sama"
            );
        }

        const user = await User.findOne({
            where: {
                id: userId,
            },
        });

        const isMatch = await comparePassword(
            request.oldPassword,
            user.password
        );

        if (!isMatch) {
            throw new ResponseError(404, "Password lama anda salah");
        }

        const hashedPassword = await hashPassword(request.newPassword);

        user.password = hashedPassword;
        user.save();

        const { password, ...userWithoutPassword } = user.toJSON();

        logger.info("User updated password successfully");
        return res.status(200).json({
            success: true,
            message: "Update Password Berhasil",
            data: userWithoutPassword,
        });
    } catch (error) {
        logger.error("Failed to updated password", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const request = validated(updateProfileValidation, req.body);

        if (request.newPassword !== request.confirmPassword) {
            throw new ResponseError(
                404,
                "Password baru dan konfirmasi password tidak sama"
            );
        }

        const user = await User.findOne({
            where: {
                id: userId,
            },
        });

        user.name = request.name;
        user.save();

        const { password, ...userWithoutPassword } = user.toJSON();

        logger.info("User updated profile successfully");
        return res.status(200).json({
            success: true,
            message: "Update Profile Berhasil",
            data: userWithoutPassword,
        });
    } catch (error) {
        logger.error("Failed to updated Profile", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
