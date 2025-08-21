import type { ImageComponent, Position, StyleDefault, TextComponent } from './common';

type Product = {
	addToCartButton?: TextComponent | null;
	collections: Array<Collection>;
	created_at: string;
	id: number;
	images: Array<ImageComponent & { shopHomeStatus?: string }>;
	productDiscount?: TextComponent | null;
	productViewDescription?: TextComponent | null;
	productViewPrice?: TextComponent | null;
	productViewTitle?: TextComponent | null;
	shopHomeImgPositions: Array<Position>;
	shopHomeImgWidths: Array<StyleDefault>;
	shopifyId: string;
	textAlignmentPosition?: Array<Position>;
	updated_at: string;
};

interface Collection {
	id: number;
	collectionId: string;
	positions: Position[];
	widths: StyleDefault[];
}

export type { Product };
