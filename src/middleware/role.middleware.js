import { ResponseError } from "./error.middleware.js";

export const authorizeRoles = (...roles) => {
    return async (req, res, next) => {
        try {
            const user = req.user;

            if (!user || !roles.includes(user.role)) {
                throw new ResponseError(
                    403,
                    "Akses ditolak. Role tidak diizinkan."
                );
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };
};

export const isAdmin = authorizeRoles("admin");
export const isViewer = authorizeRoles("viewer");
export const isEditor = authorizeRoles("editor");
