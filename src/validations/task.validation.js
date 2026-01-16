import Joi from "joi";

const createTaskValidation = Joi.object({
    title: Joi.string().min(2).max(191).required().messages({
        "any.required": `Judul wajib diisi`,
    }),
    description: Joi.string().min(2).max(5000).required().messages({
        "any.required": `Deskripsi wajib diisi`,
    }),
    status: Joi.string()
        .valid("waiting", "in_progress", "completed")
        .optional(),
});

const updateTaskValidation = Joi.object({
    title: Joi.string().min(2).max(191).optional(),
    description: Joi.string().min(2).max(5000).optional(),
    status: Joi.string()
        .valid("waiting", "in_progress", "completed")
        .optional(),
});

export { createTaskValidation, updateTaskValidation };
