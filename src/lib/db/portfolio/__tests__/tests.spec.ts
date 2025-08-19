import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Db } from '../../_types';

import { validate } from '../index';
import {
	itemImageComponentsEmpty,
	itemIncorrectTypes,
	itemInvalidNested,
	itemNoPositionOrWidth,
	itemPartial,
	itemValid
} from './mock-data';

vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('validateByFieldType', () => {
	beforeEach(() => {
		vi.clearAllMocks(); // Clear mocks to prevent leakage
	});

	it('should return true for a valid PortfolioPage object', () => {
		const result = validate(itemValid);

		expect(result).toBe(true);

		expect(console.warn).not.toHaveBeenCalled();
	});

	it('should return false for missing required fields', () => {
		const result = validate(itemPartial as Db['PortfolioPage']);

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
		const result = validate(itemIncorrectTypes as Db['PortfolioPage']);

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

	it('should return false for empty imageComponents array', () => {
		const result = validate(itemImageComponentsEmpty);

		expect(result).toBe(false);

		expect(console.warn).toHaveBeenCalled();
	});

	it('should return false for invalid nested array items', () => {
		const result = validate(itemInvalidNested as Db['PortfolioPage']);

		expect(result).toBe(false);

		expect(console.warn).toHaveBeenCalled();
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('Item 1 failed type validation:'),
			expect.arrayContaining([
				expect.objectContaining({
					message: expect.stringContaining('imageComponents[0].positions[0].id')
				}),
				expect.objectContaining({
					message: expect.stringContaining('imageComponents[0].widths[0].value')
				})
			])
		);
	});

	it('should return false for no position and no width items', () => {
		const result = validate(itemNoPositionOrWidth as Db['PortfolioPage']);

		expect(result).toBe(false);

		expect(console.warn).toHaveBeenCalled();
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('Item 1 failed type validation:'),
			expect.arrayContaining([
				expect.objectContaining({
					message: expect.stringContaining(
						'"imageComponents[0].positions" must contain at least 1 items'
					)
				}),
				expect.objectContaining({
					message: expect.stringContaining(
						'"imageComponents[0].widths" must contain at least 1 items'
					)
				})
			])
		);
	});
});
