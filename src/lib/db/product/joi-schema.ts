import Joi from 'joi';

import { positionsSchema, stylesDefaultSchema } from '^db/common';

const imageComponentSchema = Joi.object({
	id: Joi.number().required(),
	layer: Joi.number().required(),
	order: Joi.number().required(),
	image: Joi.object({
		image: Joi.object({
			url: Joi.string().required()
		}).unknown()
	}).unknown(),
	positions: positionsSchema,
	widths: stylesDefaultSchema
}).unknown();

const imageComponentsSchema = Joi.array()
	.custom((value, helpers) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const validImageComponents = (value as any[]).filter((component) => {
			const { error } = imageComponentSchema.validate(component, { convert: false });
			return !error;
		});

		if (validImageComponents.length === 0) {
			return helpers.error('any.invalid', {
				message: 'At least one valid image component required'
			});
		}

		return validImageComponents;
	})
	.required();

const productSchema = Joi.object({
	id: Joi.number().required(),
	order: Joi.number().required(),
	imageComponents: imageComponentsSchema
}).options({ stripUnknown: true });

export { productSchema };
