import type { DeepPartial } from '^lib/types';
import type { Db } from '../../_types';

const itemValid: Db['PortfolioPage'] = {
	id: 1,
	order: 10,
	created_at: '2025-01-01',
	updated_at: '2025-01-01',
	imageComponents: [
		{
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
		}
	]
};

const itemPartial: DeepPartial<Db['PortfolioPage']> = {
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
			widths: []
		}
	]
};

const itemIncorrectTypes: DeepPartial<Db['PortfolioPage']> = {
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
			widths: [],
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

const itemImageComponentsEmpty: Db['PortfolioPage'] = {
	id: 1,
	order: 1,
	created_at: '2023-01-01T00:00:00Z',
	updated_at: '2023-01-01T00:00:00Z',
	imageComponents: []
};

export { itemValid, itemPartial, itemIncorrectTypes, itemImageComponentsEmpty };
