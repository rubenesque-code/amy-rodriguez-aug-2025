import type { DeepPartial } from '^lib/types';
import type { DbSchema } from '^db/~types';

const imageComponentValid = {
	id: 100,
	layer: 0,
	order: 1,
	positions: [{ id: 1, aspectRatio: 1.0, x: 0, y: 0 }],
	widths: [{ id: 1, aspectRatio: 1.0, value: 100 }],
	image: {
		id: 200,
		created_at: '2025-01-01',
		updated_at: '2025-01-01',
		image: {
			id: 400,
			name: 'img.jpg',
			alternativeText: null,
			caption: null,
			width: 800,
			height: 600,
			formats: {} as unknown,
			hash: 'hash',
			ext: '.jpg',
			mime: 'image/jpeg',
			size: 123,
			url: 'url.jpg',
			previewUrl: null,
			provider: 'cloudinary',
			provider_metadata: { public_id: 'public', resource_type: 'image' },
			created_at: '2025-01-01',
			updated_at: '2025-01-01'
		}
	}
};

const itemValid: DbSchema['Portfolio'] = {
	id: 1,
	order: 10,
	created_at: '2025-01-01',
	updated_at: '2025-01-01',
	imageComponents: [imageComponentValid]
};

const itemPartial: DeepPartial<DbSchema['Portfolio']> = {
	// Missing id
	order: 1,
	imageComponents: [
		{
			// Missing id
			order: 1,
			image: {
				image: {
					url: 'https://example.com/image.jpg'
				}
			},
			positions: [
				{
					id: 1,
					aspectRatio: 1.5,
					x: 100
					// Missing y
				}
			],
			widths: [
				{
					id: 1,
					aspectRatio: 1.5,
					value: 100
				}
			]
		}
	]
};

const itemIncorrectTypes: DeepPartial<DbSchema['Portfolio']> = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	id: '1' as any, // Should be number
	order: 1,
	created_at: '2023-01-01T00:00:00Z',
	updated_at: '2023-01-01T00:00:00Z',
	imageComponents: [
		{
			id: 1,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			order: 'abc' as any, // Should be number
			layer: 0,
			positions: [
				{
					id: 1,
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					aspectRatio: '1.5' as any, // Should be number
					x: 100,
					y: 200
				}
			],
			widths: [
				{
					id: 1,
					aspectRatio: 1.5,
					value: 100
				}
			],
			image: {
				id: 200,
				created_at: '2025-01-01',
				updated_at: '2025-01-01',
				image: {
					id: 400,
					name: 'img.jpg',
					alternativeText: null,
					caption: null,
					width: 800,
					height: 600,
					formats: {} as unknown,
					hash: 'hash',
					ext: '.jpg',
					mime: 'image/jpeg',
					size: 123,
					url: 'url.jpg',
					previewUrl: null,
					provider: 'cloudinary',
					provider_metadata: { public_id: 'public', resource_type: 'image' },
					created_at: '2025-01-01',
					updated_at: '2025-01-01'
				}
			}
		}
	]
};

const itemImageComponentsEmpty: DbSchema['Portfolio'] = {
	id: 1,
	order: 1,
	created_at: '2023-01-01T00:00:00Z',
	updated_at: '2023-01-01T00:00:00Z',
	imageComponents: []
};

const itemInvalidNested: DeepPartial<DbSchema['Portfolio']> = {
	id: 1,
	order: 1,
	created_at: '2023-01-01T00:00:00Z',
	updated_at: '2023-01-01T00:00:00Z',
	imageComponents: [
		{
			id: 1,
			order: 1,
			layer: 0,
			image: {
				id: 1,
				created_at: '2023-01-01T00:00:00Z',
				updated_at: '2023-01-01T00:00:00Z',
				image: {
					url: 'https://example.com/image.jpg'
				}
			},
			positions: [
				{
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					id: '1' as any, // Should be number
					aspectRatio: 1.5,
					x: 100,
					y: 200
				}
			],
			widths: [
				{
					id: 1,
					aspectRatio: 1.5,
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					value: '300' as any // Should be number
				}
			]
		}
	]
};

const itemNoPositionOrWidth: DeepPartial<DbSchema['Portfolio']> = {
	id: 1,
	order: 1,
	created_at: '2023-01-01T00:00:00Z',
	updated_at: '2023-01-01T00:00:00Z',
	imageComponents: [
		{
			id: 1,
			layer: 0,
			order: 1,
			image: {
				id: 1,
				created_at: '2023-01-01T00:00:00Z',
				updated_at: '2023-01-01T00:00:00Z',
				image: {
					url: 'https://example.com/image.jpg'
				}
			},
			positions: [], // Empty, should trigger error
			widths: [] // Empty, should trigger error
		}
	]
};

export {
	imageComponentValid,
	itemValid,
	itemPartial,
	itemIncorrectTypes,
	itemImageComponentsEmpty,
	itemInvalidNested,
	itemNoPositionOrWidth
};
