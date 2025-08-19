export interface DynamicImage {
	id: string;
	order?: number;
	layer?: number;
	positions: Position[];
	url: string;
	widths: StyleWithSingleValue[];
}

export interface Position {
	id: number;
	aspectRatio: number;
	x: number;
	y: number;
}

export interface StyleWithSingleValue {
	id: number;
	aspectRatio: number;
	value: number;
}
