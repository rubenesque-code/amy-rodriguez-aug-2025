import type { CloudinaryImage } from './cloudinary';

interface Image {
	id: number;
	created_at: string;
	updated_at: string;
	image: CloudinaryImage;
}

interface Position {
	id: number;
	aspectRatio: number;
	x: number;
	y: number;
}

interface StyleWithSingleValue {
	id: number;
	aspectRatio: number;
	value: number;
}

export type { StyleWithSingleValue, Image, Position };
