import type { ImageComponent, Position, StyleDefault } from './common';

interface Portfolio {
	id: number;
	order: number;
	created_at: string;
	updated_at: string;
	imageComponents: ImageComponent[];
}

export type { Portfolio };
