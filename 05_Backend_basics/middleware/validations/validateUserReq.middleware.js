import Joi from 'joi';

const userValidationSchema = Joi.object({
    username: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.base": "Username must be a string",
            "string.empty": "Username is required",
            "string.min": "Username Not less than 6 characters, got {#value}",
            "any.required": "Username is required",
        }),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.email": "Please use a valid email address",
            "any.required": "Email is required",
        }),

    password: Joi.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
        .min(6)
        .required()
        .messages({
            "string.min": "Password must be at least 6 characters long",
            "string.pattern.base":
                "Password must contain uppercase, lowercase, number and special character",
            "any.required": "Password is required",
        }),

    otp: Joi.number().optional(),

    otp_expiry: Joi.date().optional(),

    access_token: Joi.string().optional(),

    refresh_token: Joi.string().optional(),

    isVerified: Joi.boolean().optional(),

    is_active: Joi.boolean().optional(),
    role: Joi.string().optional()
    // role: Joi.string()
    //   .valid("user", "admin")
    //   .default("user")
    //   .messages({
    //     "any.only": "Role must be either 'user' or 'admin'",
    //   }),
})


export const ValidateUserReq = async (req, res, next) => {
    const response = await userValidationSchema.validate(req.body)
    if (response.error) {
        return res.status(400).json({ Success: false, message: "Validation failed", error: response.error.details[0].message })
    }
    next()
}