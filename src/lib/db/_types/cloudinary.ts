export interface CloudinaryImage {
	id: number;
	name: string;
	alternativeText: null | string;
	caption: null | string;
	width: number;
	height: number;
	formats: Formats | unknown;
	hash: string;
	ext: string;
	mime: string;
	size: number;
	url: string;
	previewUrl: null | string;
	provider: string;
	provider_metadata: ProviderMetadata5;
	created_at: string;
	updated_at: string;
}

interface Formats {
	large: Large;
	small: Small;
	medium: Medium;
	thumbnail: Thumbnail;
}

interface Large {
	ext: string;
	url: string;
	hash: string;
	mime: string;
	name: string;
	path: null | string;
	size: number;
	width: number;
	height: number;
	provider_metadata: ProviderMetadata;
}

interface ProviderMetadata {
	public_id: string;
	resource_type: string;
}

interface Small {
	ext: string;
	url: string;
	hash: string;
	mime: string;
	name: string;
	path: null | string;
	size: number;
	width: number;
	height: number;
	provider_metadata: ProviderMetadata2;
}

interface ProviderMetadata2 {
	public_id: string;
	resource_type: string;
}

interface Medium {
	ext: string;
	url: string;
	hash: string;
	mime: string;
	name: string;
	path: null | string;
	size: number;
	width: number;
	height: number;
	provider_metadata: ProviderMetadata3;
}

interface ProviderMetadata3 {
	public_id: string;
	resource_type: string;
}

interface Thumbnail {
	ext: string;
	url: string;
	hash: string;
	mime: string;
	name: string;
	path: null | string;
	size: number;
	width: number;
	height: number;
	provider_metadata: ProviderMetadata4;
}

interface ProviderMetadata4 {
	public_id: string;
	resource_type: string;
}

interface ProviderMetadata5 {
	public_id: string;
	resource_type: string;
}
