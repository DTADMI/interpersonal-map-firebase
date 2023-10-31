export interface BaseMap {
    name: string,
    description: string,
    imgSrc: string
	people: Array<string>
}

export interface Map extends BaseMap {
    id: string;
}