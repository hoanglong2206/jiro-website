import Joi, { ObjectSchema } from "joi";

class authSchema {
	registerSchema(): ObjectSchema {
		return Joi.object({
			username: Joi.string()
				.alphanum()
				.min(3)
				.max(30)
				.required()
				.messages({
					"string.min":
						"Username must be at least {#limit} characters long",
					"string.max":
						"Username must be at most {#limit} characters long",
					"string.empty": "Username cannot be empty",
					"string.alphanum":
						"Username can only contain letters and numbers",
				}),
			email: Joi.string().email().required().messages({
				"string.email": "Invalid email address",
				"string.empty": "Email cannot be empty",
			}),
			password: Joi.string().min(6).required().messages({
				"string.min":
					"Password must be at least {#limit} characters long",
				"string.empty": "Password cannot be empty",
			}),
		});
	}

	loginSchema(): ObjectSchema {
		return Joi.object({
			email: Joi.string().email().required().messages({
				"string.email": "Invalid email address",
				"string.empty": "Email cannot be empty",
			}),
			password: Joi.string().min(6).required().messages({
				"string.min":
					"Password must be at least {#limit} characters long",
				"string.empty": "Password cannot be empty",
			}),
		});
	}

	changePasswordSchema(): ObjectSchema {
		return Joi.object({
			currentPassword: Joi.string().min(6).required().messages({
				"string.min":
					"Current password must be at least {#limit} characters long",
				"string.empty": "Current password cannot be empty",
			}),
			newPassword: Joi.string().min(6).required().messages({
				"string.min":
					"New password must be at least {#limit} characters long",
				"string.empty": "New password cannot be empty",
			}),
			confirmPassword: Joi.string()
				.valid(Joi.ref("newPassword"))
				.required()
				.messages({
					"any.only": "Confirm password must match new password",
					"string.empty": "Confirm password cannot be empty",
				}),
		});
	}
}

export default new authSchema();
