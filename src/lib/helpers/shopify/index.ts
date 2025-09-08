export * from './graphql';

function extractNumberFromShopifyId(id: string) {
	return id.split('/').pop();
}

export { extractNumberFromShopifyId };
