import Joi, { ObjectSchema } from "joi";

const taskPriority = Joi.string().valid("low", "medium", "high", "urgent");
const taskStatus = Joi.string().valid("todo", "in-progress", "done", "blocked");

class TaskSchema {
	createTask(): ObjectSchema {
		return Joi.object({
			task: Joi.object({
				title: Joi.string().min(1).max(500).required().messages({
					"string.min": "Task title must be at least {#limit} character long",
					"string.max": "Task title must be at most {#limit} characters long",
					"string.empty": "Task title is required",
					"any.required": "Task title is required",
				}),
				description: Joi.string().allow(null, "").max(5000),
				priority: taskPriority.default("medium"),
				status: taskStatus.default("todo"),
				position: Joi.number().integer().min(0).messages({
					"number.min": "Task position must be zero or greater",
					"number.base": "Task position must be a valid number",
					"number.integer": "Task position must be an integer",
				}),
				dueDate: Joi.date().allow(null),
				startDate: Joi.date().allow(null),
			}).required(),
		});
	}

	updateTask(): ObjectSchema {
		return Joi.object({
			task: Joi.object({
				title: Joi.string().min(1).max(500).messages({
					"string.min": "Task title must be at least {#limit} character long",
					"string.max": "Task title must be at most {#limit} characters long",
					"string.empty": "Task title cannot be empty",
				}),
				description: Joi.string().allow(null, "").max(5000),
				priority: taskPriority,
				status: taskStatus,
				position: Joi.number().integer().min(0).messages({
					"number.min": "Task position must be zero or greater",
					"number.base": "Task position must be a valid number",
					"number.integer": "Task position must be an integer",
				}),
				dueDate: Joi.date().allow(null),
				startDate: Joi.date().allow(null),
			})
				.required()
				.min(1),
		});
	}

	createComment(): ObjectSchema {
		return Joi.object({
			comment: Joi.object({
				content: Joi.string().min(1).max(5000).required().messages({
					"string.min":
						"Comment content must be at least {#limit} character long",
					"string.max":
						"Comment content must be at most {#limit} characters long",
					"string.empty": "Comment content is required",
					"any.required": "Comment content is required",
				}),
				parentId: Joi.string().uuid().allow(null),
			}).required(),
		});
	}

	updateComment(): ObjectSchema {
		return Joi.object({
			comment: Joi.object({
				content: Joi.string().min(1).max(5000).required().messages({
					"string.min":
						"Comment content must be at least {#limit} character long",
					"string.max":
						"Comment content must be at most {#limit} characters long",
					"string.empty": "Comment content is required",
					"any.required": "Comment content is required",
				}),
			}).required(),
		});
	}

	assignTask(): ObjectSchema {
		return Joi.object({
			assignee: Joi.object({
				userId: Joi.string().uuid().required().messages({
					"string.empty": "User ID is required",
					"any.required": "User ID is required",
					"string.uuid": "User ID must be a valid UUID",
				}),
				userEmail: Joi.string().email().allow(null, ""),
				userFullname: Joi.string().allow(null, ""),
				userProfilePicture: Joi.string().uri().allow(null, ""),
			}).required(),
		});
	}
}

export default new TaskSchema();
