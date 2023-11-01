export interface BaseMap {
    name: string,
    description: string,
    imgSrc: string,
	people: Array<string>,
	relationships: Array<string>,
    owner: string
}

export interface Map extends BaseMap {
    id: string;
}