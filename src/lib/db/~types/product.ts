import type { MyOmit } from '^lib/types';
import type { ImageComponent, Position, StyleDefault, TextComponent } from './common';

type ProductRaw = {
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

type ProductProcessed = MyOmit<ProductRaw, 'collections' | 'created_at' | 'updated_at'>;

interface Collection {
	id: number;
	collectionId: string;
	positions: Position[];
	widths: StyleDefault[];
}

export type { ProductRaw, ProductProcessed };
