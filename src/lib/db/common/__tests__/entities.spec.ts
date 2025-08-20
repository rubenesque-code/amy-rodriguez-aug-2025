import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { DbSchema } from '^db';
import { positionSchema } from '../utils';
import Joi from 'joi';

function validatePosition(item: DbSchema['Position']) {
	const { error } = positionSchema.validate(item, {
		abortEarly: false,
		allowUnknown: true,
		convert: false
	});

	if (error) {
		console.warn(`Item ${item.id} failed type validation:`, error.details);
	}

	return !error;
}

vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('position schema basic validation', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const valid: DbSchema['Position'] = {
		id: 123,
		aspectRatio: 1.2,
		x: 100,
		y: 200
	};

	it('should return true for a valid position object', () => {
		const result = validatePosition(valid);

		expect(result).toBe(true);

		expect(console.warn).not.toHaveBeenCalled();
	});

	it('should return false for an invalid position object', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result = validatePosition({ ...valid, id: 'abc' as any });

		expect(result).toBe(false);

		expect(console.warn).toHaveBeenCalled();
	});
});

describe('nested position validation', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

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

		console.log('value:', value);

		if (error) {
			console.warn(`Item ${item.id} failed type validation:`, error.details);
		}

		return !error;
	}

	it('should return true with valid position only', () => {
		const result = validateEntity(entityValidPositionOnly);

		expect(result).toBe(true);

		expect(console.warn).not.toHaveBeenCalled();
	});

	it('should return true when containing mixed validity positions', () => {
		const result = validateEntity(entityMixedValidityPositions);

		expect(result).toBe(true);

		expect(console.warn).not.toHaveBeenCalled();
	});

	it('should return false when containing invalid position only', () => {
		const result = validateEntity(entityInvalidPositionOnly);

		expect(result).toBe(false);

		expect(console.warn).toHaveBeenCalled();
	});
});
