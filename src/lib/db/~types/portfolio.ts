import type { Image, Position, StyleDefault } from './common';

interface Portfolio {
	id: number;
	order: number;
	created_at: string;
	updated_at: string;
	imageComponents: ImageComponent[];
}

interface ImageComponent {
	id: number;
	layer: number;
	order: number;
	positions: Position[];
	widths: StyleDefault[];
	image: Image;
}

export type { Portfolio };
