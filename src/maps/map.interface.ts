export interface BaseMap {
    name: string,
    description: string,
    imgSrc: string,
	people: Array<string>,
    owner: string,
    lastModificationDate?: string
}

export interface Map extends BaseMap {
    id: string;
}