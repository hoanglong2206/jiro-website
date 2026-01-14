import Joi, { ObjectSchema } from "joi";

const projectType = Joi.string().valid("work", "personal").required().messages({
	"any.only": "Project type must be either 'work' or 'personal'",
	"string.empty": "Project type is required",
});

const memberIdsSchema = Joi.array()
	.items(
		Joi.string().guid({ version: "uuidv4" }).messages({
			"string.guid": "Member IDs must be valid UUIDs",
		}),
	)
	.unique()
	.messages({
		"array.unique": "Member IDs must be unique",
	});

class ProjectSchema {
	create(): ObjectSchema {
		return Joi.object({
			name: Joi.string().min(2).max(120).required().messages({
				"string.min": "Project name must be at least {#limit} characters long",
				"string.max": "Project name must be at most {#limit} characters long",
				"string.empty": "Project name is required",
			}),
			description: Joi.string().allow(null, "").max(1000),
			type: projectType,
			icon: Joi.string().uri().allow(null, "").messages({
				"string.uri": "Icon must be a valid URL",
			}),
			memberIds: memberIdsSchema,
		});
	}

	update(): ObjectSchema {
		return Joi.object({
			name: Joi.string().min(2).max(120).messages({
				"string.min": "Project name must be at least {#limit} characters long",
				"string.max": "Project name must be at most {#limit} characters long",
			}),
			description: Joi.string().allow(null, "").max(1000),
			type: Joi.string().valid("work", "personal").messages({
				"any.only": "Project type must be either 'work' or 'personal'",
			}),
			icon: Joi.string().uri().allow(null, "").messages({
				"string.uri": "Icon must be a valid URL",
			}),
			memberIds: memberIdsSchema,
		}).min(1);
	}
}

export default new ProjectSchema();
