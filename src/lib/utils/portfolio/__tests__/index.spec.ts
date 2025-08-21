import { describe, it, expect, vi, beforeEach } from 'vitest';

import type { DbSchema } from '^db/~types/common';
import type { DeepPartial, SiteSchema } from '^lib/types';

import { mapPortfolioToSite, compareByOrderThenId } from '../index';

const mockUUIDs = [
	'123e4567-e89b-12d3-a456-426614174000',
	'123e4567-e89b-12d3-a456-426614174001',
	'123e4567-e89b-12d3-a456-426614174002',
	'123e4567-e89b-12d3-a456-426614174003',
	'123e4567-e89b-12d3-a456-426614174004',
	'123e4567-e89b-12d3-a456-426614174005',
	'123e4567-e89b-12d3-a456-426614174006'
] as const;

let uuidIndex = 0;

vi.spyOn(crypto, 'randomUUID').mockImplementation(() => {
	return mockUUIDs[uuidIndex++] as `${string}-${string}-${string}-${string}-${string}`;
});

describe('mapDbToSiteSchema', () => {
	beforeEach(() => {
		uuidIndex = 0; // Reset UUID index
		vi.clearAllMocks(); // Clear mocks to prevent leakage
	});

	it('should correctly map a valid PortfolioPage with populated arrays to SchemaType', () => {
		const input: DeepPartial<DbSchema['PortfolioPage']> = {
			id: 1,
			order: 1,
			created_at: '2023-01-01T00:00:00Z',
			updated_at: '2023-01-01T00:00:00Z',
			imageComponents: [
				{
					id: 2,
					layer: 0,
					order: 2,
					image: {
						id: 3,
						created_at: '2023-01-01T00:00:00Z',
						updated_at: '2023-01-01T00:00:00Z',
						image: {
							url: 'https://example.com/image1.jpg'
						}
					},
					positions: [
						{
							id: 4,
							aspectRatio: 1.5,
							x: 100,
							y: 200
						},
						{
							id: 5,
							aspectRatio: 1.7,
							x: 150,
							y: 250
						}
					],
					widths: [
						{
							id: 6,
							aspectRatio: 1.5,
							value: 50
						},
						{
							id: 7,
							aspectRatio: 1.7,
							value: 75
						}
					]
				}
			]
		};

		const result = mapPortfolioToSite(input as DbSchema['PortfolioPage']);

		expect(result).toEqual({
			id: '123e4567-e89b-12d3-a456-426614174000',
			order: 1,
			imageComponents: [
				{
					id: '123e4567-e89b-12d3-a456-426614174001',
					layer: 0,
					order: 2,
					url: 'https://example.com/image1.jpg',
					positions: [
						{
							id: '123e4567-e89b-12d3-a456-426614174002',
							aspectRatio: 1.5,
							x: 100,
							y: 200
						},
						{
							id: '123e4567-e89b-12d3-a456-426614174003',
							aspectRatio: 1.7,
							x: 150,
							y: 250
						}
					],
					widths: [
						{
							id: '123e4567-e89b-12d3-a456-426614174004',
							aspectRatio: 1.5,
							value: 50
						},
						{
							id: '123e4567-e89b-12d3-a456-426614174005',
							aspectRatio: 1.7,
							value: 75
						}
					]
				}
			]
		});
		expect(crypto.randomUUID).toHaveBeenCalledTimes(6); // Root id, imageComponent id, 2 position ids, 2 width ids
	});
});

const createSchemaType = (id: string, order: number): SiteSchema['PortfolioPage'] => ({
	id,
	order,
	imageComponents: [
		{
			id: '123e4567-e89b-12d3-a456-426614174000',
			layer: 0,
			order: 1,
			url: 'https://example.com/image.jpg',
			positions: [{ id: '123e4567-e89b-12d3-a456-426614174001', aspectRatio: 1.5, x: 100, y: 200 }],
			widths: [{ id: '123e4567-e89b-12d3-a456-426614174002', aspectRatio: 1.5, value: 50 }]
		}
	]
});

export function sortByOrderThenId(
	items: SiteSchema['PortfolioPage'][]
): SiteSchema['PortfolioPage'][] {
	return items.sort(compareByOrderThenId);
}

describe('sortByOrderThenId', () => {
	it('should sort by order when order values differ', () => {
		const input: SiteSchema['PortfolioPage'][] = [
			createSchemaType('123e4567-e89b-12d3-a456-426614174001', 2),
			createSchemaType('123e4567-e89b-12d3-a456-426614174002', 1),
			createSchemaType('123e4567-e89b-12d3-a456-426614174003', 3)
		];

		const result = sortByOrderThenId(input);
		expect(result).toEqual([
			createSchemaType('123e4567-e89b-12d3-a456-426614174002', 1),
			createSchemaType('123e4567-e89b-12d3-a456-426614174001', 2),
			createSchemaType('123e4567-e89b-12d3-a456-426614174003', 3)
		]);
	});

	it('should sort by id when order values are equal', () => {
		const input: SiteSchema['PortfolioPage'][] = [
			createSchemaType('uuid-b', 1),
			createSchemaType('uuid-a', 1),
			createSchemaType('uuid-c', 1)
		];

		const result = sortByOrderThenId(input);
		expect(result).toEqual([
			createSchemaType('uuid-a', 1),
			createSchemaType('uuid-b', 1),
			createSchemaType('uuid-c', 1)
		]);
	});

	it('should sort by order then id when both vary', () => {
		const input: SiteSchema['PortfolioPage'][] = [
			createSchemaType('uuid-b', 2),
			createSchemaType('uuid-a', 1),
			createSchemaType('uuid-c', 2),
			createSchemaType('uuid-d', 1)
		];

		const result = sortByOrderThenId(input);
		expect(result).toEqual([
			createSchemaType('uuid-a', 1),
			createSchemaType('uuid-d', 1),
			createSchemaType('uuid-b', 2),
			createSchemaType('uuid-c', 2)
		]);
	});

	it('should handle an empty array', () => {
		const input: SiteSchema['PortfolioPage'][] = [];
		const result = sortByOrderThenId(input);
		expect(result).toEqual([]);
	});

	it('should handle a single-item array', () => {
		const input: SiteSchema['PortfolioPage'][] = [
			createSchemaType('123e4567-e89b-12d3-a456-426614174001', 1)
		];
		const result = sortByOrderThenId(input);
		expect(result).toEqual([createSchemaType('123e4567-e89b-12d3-a456-426614174001', 1)]);
	});
});
