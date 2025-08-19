import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Db } from '../../_types';

import { validateByFieldType } from '../index';
import { itemImageComponentsEmpty, itemIncorrectTypes, itemPartial, itemValid } from './mock-data';

vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('validateByFieldType', () => {
	beforeEach(() => {
		vi.clearAllMocks(); // Clear mocks to prevent leakage
	});

	it('should return true for a valid PortfolioPage object', () => {
		const result = validateByFieldType(itemValid);

		expect(result).toBe(true);

		expect(console.warn).not.toHaveBeenCalled();
	});

	it('should return false for missing required fields', () => {
		const result = validateByFieldType(itemPartial as Db['PortfolioPage']);

		expect(result).toBe(false);

		expect(console.warn).toHaveBeenCalled();
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('Item undefined failed type validation:'),
			expect.arrayContaining([
				expect.objectContaining({ message: expect.stringContaining('"id" is required') }),
				expect.objectContaining({ message: expect.stringContaining('imageComponents[0].id') }),
				expect.objectContaining({
					message: expect.stringContaining('imageComponents[0].positions[0].y')
				})
			])
		);
	});

	it('should return false and log warnings for invalid types in invalidItemIncorrectTypes', () => {
		const result = validateByFieldType(itemIncorrectTypes as Db['PortfolioPage']);

		expect(result).toBe(false);

		expect(console.warn).toHaveBeenCalled();
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('Item 1 failed type validation:'),
			expect.arrayContaining([
				expect.objectContaining({ message: expect.stringContaining('"id" must be a number') }),
				expect.objectContaining({
					message: expect.stringContaining('"imageComponents[0].order" must be a number')
				}),
				expect.objectContaining({
					message: expect.stringContaining(
						'"imageComponents[0].positions[0].aspectRatio" must be a number'
					)
				})
			])
		);
	});

	it('should return true for empty imageComponents array', () => {
		const result = validateByFieldType(itemImageComponentsEmpty);

		expect(result).toBe(true);

		expect(console.warn).not.toHaveBeenCalled();
	});
});
