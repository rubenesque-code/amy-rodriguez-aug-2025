import Joi from 'joi';

import type { Db } from '^lib/types';

const schema = Joi.object({
	id: Joi.number().required(),
	order: Joi.number().required(),
	imageComponents: Joi.array().items(
		Joi.object({
			id: Joi.number().required(),
			order: Joi.number().required(),
			image: Joi.object({
				image: Joi.object({
					url: Joi.string().required()
				})
			}),
			positions: Joi.array().items(
				Joi.object({
					id: Joi.number().required(),
					aspectRatio: Joi.number().required(),
					x: Joi.number().required(),
					y: Joi.number().required()
				})
			),
			widths: Joi.array().items(
				Joi.object({
					id: Joi.number().required(),
					aspectRatio: Joi.number().required(),
					value: Joi.number().required()
				})
			)
		})
	)
});

function validateByFieldType(item: Db['PortfolioPage']): boolean {
	const { error } = schema.validate(item, { abortEarly: false, allowUnknown: true });

	if (error) {
		console.warn(`Item ${item.id} failed type validation:`, error.details);
	}

	return !error;
}

export { validateByFieldType };
