import Joi, { ObjectSchema } from "joi";

class userSchema {
	updateUserSchema(): ObjectSchema {
		return Joi.object({
			fullname: Joi.string().min(3).max(50).messages({
				"string.min":
					"Full name must be at least {#limit} characters long",
				"string.max":
					"Full name must be at most {#limit} characters long",
			}),
			profilePicture: Joi.string().uri().messages({
				"string.uri": "Invalid profile picture URL",
			}),
			colorAvatar: Joi.string(),
			jobTitle: Joi.string(),
		}).min(1);
	}
}

export default new userSchema();
