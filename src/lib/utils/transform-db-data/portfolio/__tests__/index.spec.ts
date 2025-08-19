import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mapDbToSiteSchema } from '../index'; // Adjust the import path
import type { Db } from '^lib/db/_types'; // Adjust the import path
import type { DeepPartial } from '^lib/types';

// Mock crypto.randomUUID with valid UUIDs
const mockUUIDs = [
	'123e4567-e89b-12d3-a456-426614174000',
	'123e4567-e89b-12d3-a456-426614174001',
	'123e4567-e89b-12d3-a456-426614174002',
	'123e4567-e89b-12d3-a456-426614174003',
	'123e4567-e89b-12d3-a456-426614174004',
	'123e4567-e89b-12d3-a456-426614174005',
	'123e4567-e89b-12d3-a456-426614174006'
] as const; // Type assertion to treat as literal UUIDs
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
		const input: DeepPartial<Db['PortfolioPage']> = {
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

		const result = mapDbToSiteSchema(input as Db['PortfolioPage']);

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
