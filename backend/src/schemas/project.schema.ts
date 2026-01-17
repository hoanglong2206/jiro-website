import Joi, { ObjectSchema } from "joi";

const projectType = Joi.string().valid("work", "personal").required().messages({
	"any.only": "Project type must be either 'work' or 'personal'",
	"string.empty": "Project type is required",
});

const projectAccessLevel = Joi.string()
	.valid("private", "public")
	.required()
	.messages({
		"any.only": "Project access level must be either 'private' or 'public'",
		"string.empty": "Project access level is required",
	});

class ProjectSchema {
	create(): ObjectSchema {
		return Joi.object({
			name: Joi.string().min(2).max(120).required().messages({
				"string.min":
					"Project name must be at least {#limit} characters long",
				"string.max":
					"Project name must be at most {#limit} characters long",
				"string.empty": "Project name is required",
			}),
			type: projectType,
			accessLevel: projectAccessLevel,
			color: Joi.string().allow(null, ""),
			description: Joi.string().allow(null, "").max(1000),
			icon: Joi.string().uri().allow(null, "").messages({
				"string.uri": "Icon must be a valid URL",
			}),
		});
	}

	update(): ObjectSchema {
		return Joi.object({
			name: Joi.string().min(2).max(120).messages({
				"string.min":
					"Project name must be at least {#limit} characters long",
				"string.max":
					"Project name must be at most {#limit} characters long",
			}),
			description: Joi.string().allow(null, "").max(1000),
			type: projectType,
			accessLevel: projectAccessLevel,
			color: Joi.string().allow(null, ""),
			icon: Joi.string().uri().allow(null, "").messages({
				"string.uri": "Icon must be a valid URL",
			}),
		}).min(1);
	}
}

export default new ProjectSchema();
