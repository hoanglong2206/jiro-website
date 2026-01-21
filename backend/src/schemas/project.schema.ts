import Joi, { ObjectSchema } from "joi";

const projectType = Joi.string().valid("work", "personal");
const projectAccessLevel = Joi.string().valid("private", "public");

class ProjectSchema {
	createProject(): ObjectSchema {
		return Joi.object({
			name: Joi.string().min(2).max(120).required().messages({
				"string.min": "Project name must be at least {#limit} characters long",
				"string.max": "Project name must be at most {#limit} characters long",
				"string.empty": "Project name is required",
			}),
			type: projectType,
			accessLevel: projectAccessLevel,
			color: Joi.string().allow(null, ""),
			description: Joi.string().allow(null, "").max(1000),
			icon: Joi.string().uri().allow(null, "").messages({
				"string.uri": "Icon must be a valid URL",
			}),
			user: Joi.object().required(),
		});
	}

	updateProject(): ObjectSchema {
		return Joi.object({
			project: Joi.object({
				name: Joi.string().min(2).max(120),
				description: Joi.string().allow(null, "").max(1000),
				type: projectType,
				accessLevel: projectAccessLevel,
				color: Joi.string().allow(null, ""),
				icon: Joi.string().uri().allow(null, ""),
			}).required(),
			userId: Joi.string().required(),
		}).min(1);
	}

	createWorkspace(): ObjectSchema {
		return Joi.object({
			workspace: Joi.object({
				name: Joi.string().trim().min(2).max(120).required().messages({
					"string.min":
						"Workspace name must be at least {#limit} characters long",
					"string.max":
						"Workspace name must be at most {#limit} characters long",
					"any.required": "Workspace name is required",
					"string.empty": "Workspace name is required",
				}),
				key: Joi.string()
					.trim()
					.pattern(/^[A-Za-z0-9][A-Za-z0-9_-]{1,9}$/)
					.required()
					.messages({
						"string.pattern.base":
							"Workspace key must start with an alphanumeric character and contain only letters, numbers, hyphens, or underscores (2-10 chars)",
						"any.required": "Workspace key is required",
						"string.empty": "Workspace key is required",
					}),
				color: Joi.string().allow(null, ""),
			}).required(),
		});
	}

	updateWorkspace(): ObjectSchema {
		return Joi.object({
			workspace: Joi.object({
				name: Joi.string().trim().min(2).max(120).messages({
					"string.min":
						"Workspace name must be at least {#limit} characters long",
					"string.max":
						"Workspace name must be at most {#limit} characters long",
					"string.empty": "Workspace name cannot be empty",
				}),
				key: Joi.string()
					.trim()
					.pattern(/^[A-Za-z0-9][A-Za-z0-9_-]{1,9}$/)
					.messages({
						"string.pattern.base":
							"Workspace key must start with an alphanumeric character and contain only letters, numbers, hyphens, or underscores (2-10 chars)",
						"string.empty": "Workspace key cannot be empty",
					}),
				color: Joi.string().allow(null, ""),
			})
				.required()
				.min(1),
		});
	}

	createBoard(): ObjectSchema {
		return Joi.object({
			board: Joi.object({
				name: Joi.string().trim().min(2).max(120).required().messages({
					"string.min": "Board name must be at least {#limit} characters long",
					"string.max": "Board name must be at most {#limit} characters long",
					"any.required": "Board name is required",
					"string.empty": "Board name is required",
				}),
				color: Joi.string().allow(null, ""),
				position: Joi.number().integer().min(0).messages({
					"number.min": "Board position must be zero or greater",
					"number.base": "Board position must be a valid number",
					"number.integer": "Board position must be an integer",
				}),
			}).required(),
		});
	}

	updateBoard(): ObjectSchema {
		return Joi.object({
			board: Joi.object({
				name: Joi.string().trim().min(2).max(120).messages({
					"string.min": "Board name must be at least {#limit} characters long",
					"string.max": "Board name must be at most {#limit} characters long",
					"string.empty": "Board name cannot be empty",
				}),
				color: Joi.string().allow(null, ""),
				position: Joi.number().integer().min(0).messages({
					"number.min": "Board position must be zero or greater",
					"number.base": "Board position must be a valid number",
					"number.integer": "Board position must be an integer",
				}),
			})
				.required()
				.min(1),
		});
	}
}

export default new ProjectSchema();
