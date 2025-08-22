export type Shopify = {
	Cart: Cart;
	Product: Product;
};

type Product = {
	id: string;
	description: string;
	descriptionHtml: string;
	title: string;
	variants: {
		edges: {
			node: {
				id: string;
				availableForSale: boolean;
				compareAtPrice?: { amount: string };
				price: { amount: string };
			};
		}[];
	};
};

type Cart = {
	id: string;
	checkoutUrl: string;
};
