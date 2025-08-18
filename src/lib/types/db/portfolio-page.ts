import type { Image, Position, StyleWithSingleValue } from './_common';

export interface PortfolioPage {
	id: number;
	order: number;
	created_at: string;
	updated_at: string;
	imageComponents: ImageComponent[];
}

interface ImageComponent {
	id: number;
	image: Image;
	order: number;
	layer: number;
	positions: Position[];
	widths: StyleWithSingleValue[];
}
