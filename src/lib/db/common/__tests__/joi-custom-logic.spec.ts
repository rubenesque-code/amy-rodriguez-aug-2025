import Joi from 'joi';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { DbSchema } from '^db';
import { positionSchema } from '../joi-schemas';

const validPosition: DbSchema['Position'] = {
	id: 123,
	aspectRatio: 1.2,
	x: 100,
	y: 200
};
const invalidPosition: DbSchema['Position'] = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	id: '123' as any,
	aspectRatio: 1.2,
	x: 100,
	y: 200
};

type MyEntity = {
	id: string;
	positions: Array<DbSchema['Position']>;
};

const entityValidPositionOnly = {
	id: 'abc',
	positions: [validPosition]
};

const entityMixedValidityPositions = {
	id: 'abc',
	positions: [validPosition, invalidPosition]
};

const entityInvalidPositionOnly = {
	id: 'abc',
	positions: [invalidPosition]
};

const schema = Joi.object({
	id: Joi.string().required(),
	positions: Joi.array()
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
		.required()
});

function validateEntity(item: MyEntity) {
	const { error, value } = schema.validate(item, {
		abortEarly: false,
		allowUnknown: true,
		convert: false
	});

	if (error) {
		console.warn(`Item ${item.id} failed type validation:`, error.details);
	}

	return { isValid: !error, value };
}

vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('nested entity validation', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return true and initial value with valid position only', () => {
		const result = validateEntity(entityValidPositionOnly);

		expect(result.isValid).toBe(true);
		expect(result.value).toStrictEqual(entityValidPositionOnly);
		expect(console.warn).not.toHaveBeenCalled();
	});

	it('should return true and valid positions only when containing mixed validity positions', () => {
		const result = validateEntity(entityMixedValidityPositions);

		expect(result.isValid).toBe(true);
		expect(result.value).toStrictEqual(entityValidPositionOnly);
		expect(console.warn).not.toHaveBeenCalled();
	});

	it('should return false when containing invalid position only', () => {
		const result = validateEntity(entityInvalidPositionOnly);

		expect(result.isValid).toBe(false);
		expect(console.warn).toHaveBeenCalled();
	});

	it('should return false when positions array is empty', () => {
		const entityEmptyPositions = {
			id: 'abc',
			positions: []
		};

		const result = validateEntity(entityEmptyPositions);

		expect(result.isValid).toBe(false);

		expect(console.warn).toHaveBeenCalledWith(
			'Item abc failed type validation:',
			expect.arrayContaining([
				expect.objectContaining({
					context: expect.objectContaining({
						message: 'At least one valid position required'
					})
				})
			])
		);
	});
});
