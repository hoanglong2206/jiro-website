import Joi, { ObjectSchema } from "joi";

class authSchema {
	registerSchema(): ObjectSchema {
		return Joi.object({
			username: Joi.string().alphanum().min(3).max(30).required(),
			email: Joi.string().email().required(),
			password: Joi.string().min(6).required(),
		});
	}

	loginSchema(): ObjectSchema {
		return Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().min(6).required(),
		});
	}

	changePasswordSchema(): ObjectSchema {
		return Joi.object({
			currentPassword: Joi.string().min(6).required(),
			newPassword: Joi.string()
				.min(6)
				.invalid(Joi.ref("currentPassword"))
				.required()
				.messages({
					"any.invalid": "New password must be different from current password",
				}),
			confirmPassword: Joi.any()
				.valid(Joi.ref("newPassword"))
				.required()
				.messages({
					"any.only": "Passwords do not match",
					"any.required": "Confirm password is required",
				}),
		});
	}
}

export default new authSchema();
