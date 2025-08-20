import type { Image, Position, StyleWithSingleValue, TextComponent } from './common';

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
	shopHomeImgWidths: StyleWithSingleValue[];
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
	widths: StyleWithSingleValue[];
}

interface Collection {
	id: number;
	collectionId: string;
	positions: Position[];
	widths: StyleWithSingleValue[];
}

export type { Product };
