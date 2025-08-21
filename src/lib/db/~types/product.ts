import type { Image, Position, StyleDefault, TextComponent } from './common';

type Product = {
	addToCartButton?: TextComponent;
	collections: Collection[];
	created_at: string;
	id: number;
	images: (ImageComponent & { shopHomeStatus?: string })[];
	productDiscount?: TextComponent;
	productViewDescription?: TextComponent;
	productViewPrice?: TextComponent;
	productViewTitle?: TextComponent;
	shopHomeImgPositions: Position[];
	shopHomeImgWidths: StyleDefault[];
	shopifyId: string;
	textAlignmentPosition?: Position[];
	updated_at: string;
};

interface ImageComponent {
	id: number;
	image: Image;
	order: number;
	layer: number;
	positions: Position[];
	widths: StyleDefault[];
}

interface Collection {
	id: number;
	collectionId: string;
	positions: Position[];
	widths: StyleDefault[];
}

export type { Product };
