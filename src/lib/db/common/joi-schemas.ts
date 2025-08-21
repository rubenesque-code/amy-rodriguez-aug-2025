import Joi from 'joi';

import type { DbSchema } from '^db/~types';
import { buildSchema } from '^utils/joi';

const positionSchema = buildSchema<DbSchema['Position']>({
	id: Joi.number().required(),
	aspectRatio: Joi.number().required(),
	x: Joi.number().required(),
	y: Joi.number().required()
});

const positionsSchema = Joi.array()
	.custom((value, helpers) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const validPositions = (value as any[]).filter((pos) => {
			const { error } = positionSchema.validate(pos, { convert: false });
			return !error;
		});

		if (validPositions.length === 0) {
			return helpers.error('any.invalid', {
				message: 'At least one valid position required'
			});
		}

		return validPositions;
	})
	.required();

const styleDefaultSchema = buildSchema<DbSchema['StyleDefault']>({
	id: Joi.number().required(),
	aspectRatio: Joi.number().required(),
	value: Joi.number().required()
});

const stylesDefaultSchema = Joi.array()
	.custom((value, helpers) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const validStyles = (value as any[]).filter((style) => {
			const { error } = styleDefaultSchema.validate(style, { convert: false });
			return !error;
		});

		if (validStyles.length === 0) {
			return helpers.error('any.invalid', {
				message: 'At least one valid style required'
			});
		}

		return validStyles;
	})
	.required();

const textComponentSchema = buildSchema<DbSchema['TextComponent']>({
	id: Joi.number().required(),
	fontSizes: Joi.array().items(styleDefaultSchema).min(1).required(),
	fontWeights: Joi.array().items(styleDefaultSchema).min(1).required(),
	positions: Joi.array().items(positionSchema).min(1).required()
});

const textComponentsSchema = Joi.array()
	.custom((value, helpers) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const validTextComponents = (value as any[]).filter((text) => {
			const { error } = textComponentSchema.validate(text, { convert: false });
			return !error;
		});

		if (validTextComponents.length === 0) {
			return helpers.error('any.invalid', {
				message: 'At least one valid text component required'
			});
		}

		return validTextComponents;
	})
	.required();

export {
	positionSchema,
	positionsSchema,
	styleDefaultSchema,
	stylesDefaultSchema,
	textComponentSchema,
	textComponentsSchema
};
