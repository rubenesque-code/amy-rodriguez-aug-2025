import type { CloudinaryImage } from './cloudinary';

interface StyleWithSingleValue {
	id: number;
	aspectRatio: number;
	value: number;
}

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

export type { StyleWithSingleValue, Image, Position };
