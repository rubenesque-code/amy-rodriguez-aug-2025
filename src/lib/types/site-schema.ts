type SiteSchema = {
	Portfolio: Portfolio;
	Product: Product;
};

export type { SiteSchema };

interface Portfolio {
	id: string;
	order: number;
	imageComponents: Array<ImageComponent>;
}

type Product = {
	addToCartButton?: Array<TextComponent>;
	id: number;
	images: Array<ImageComponent & { shopHomeStatus?: string }>;
	productDiscount?: Array<TextComponent>;
	productViewDescription?: Array<TextComponent>;
	productViewPrice?: Array<TextComponent>;
	productViewTitle?: Array<TextComponent>;
	shopHomeImgPositions: Array<Position>;
	shopHomeImgWidths: Array<StyleDefault>;
	shopifyId: string;
	textAlignmentPosition?: Array<Position>;
};

type StyleDefault = {
	id: string;
	aspectRatio: number;
	value: number;
};

type Position = {
	id: string;
	aspectRatio: number;
	x: number;
	y: number;
};

type TextComponent = {
	id: string;
	fontSizes: Array<StyleDefault>;
	fontWeights: Array<StyleDefault>;
	positions: Array<Position>;
};

type ImageComponent = {
	id: string;
	layer: number;
	order: number;
	positions: Array<Position>;
	url: string;
	widths: Array<StyleDefault>;
};
