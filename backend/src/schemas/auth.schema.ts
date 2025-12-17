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
}

export default new authSchema();
