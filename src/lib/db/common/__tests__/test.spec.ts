import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { DbSchema } from '^db';
import { positionSchema } from '../utils';

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

	it('should return false for a invalid position object', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result = validatePosition({ ...valid, id: 'abc' as any });

		expect(result).toBe(false);

		expect(console.warn).toHaveBeenCalled();
	});
});
