import Joi, { ObjectSchema } from "joi";

class userSchema {
	updateUserSchema(): ObjectSchema {
		return Joi.object({
			fullname: Joi.string().min(3).max(50).messages({
				"string.min": "Full name must be at least {#limit} characters long",
				"string.max": "Full name must be at most {#limit} characters long",
				"string.empty": "Full name cannot be empty",
			}),
			username: Joi.string().alphanum().min(3).max(30).messages({
				"string.min": "Username must be at least {#limit} characters long",
				"string.max": "Username must be at most {#limit} characters long",
				"string.empty": "Username cannot be empty",
				"string.alphanum": "Username can only contain letters and numbers",
			}),
			email: Joi.string().email().messages({
				"string.email": "Invalid email address",
				"string.empty": "Email cannot be empty",
			}),
		}).min(1);
	}
}

export default new userSchema();
