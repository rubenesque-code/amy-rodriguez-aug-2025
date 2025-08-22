type SiteSchema = {
	Portfolio: Portfolio;
	ProductDb: ProductDb;
	ProductShopify: ProductShopify;
};

export type { SiteSchema };

interface Portfolio {
	id: string;
	order: number;
	imageComponents: Array<ImageComponent>;
}

type ProductDb = {
	addToCartButton?: TextComponent;
	id: number;
	images: Array<ImageComponent & { shopHomeStatus?: string }>;
	productDiscount?: TextComponent;
	productViewDescription?: TextComponent;
	productViewPrice?: TextComponent;
	productViewTitle?: TextComponent;
	shopHomeImgPositions: Array<Position>;
	shopHomeImgWidths: Array<StyleDefault>;
	shopifyId: string;
	textAlignmentPosition?: Array<Position>;
};

type ProductShopify = {
	availableForSale: boolean;
	preSalePrice: number | null;
	variantId: string;
	price: number;
	description: string;
	id: string;
	title: string;
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
