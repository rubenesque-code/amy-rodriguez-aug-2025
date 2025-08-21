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

interface StyleDefault {
	id: number;
	aspectRatio: number;
	value: number;
}

type TextComponent = {
	id: number;
	fontSizes: StyleDefault[];
	fontWeights: StyleDefault[];
	positions: Position[];
};

export type { StyleDefault, Image, Position, TextComponent };
