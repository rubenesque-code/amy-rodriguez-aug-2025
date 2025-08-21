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

export { imageComponentValid, itemValid };
