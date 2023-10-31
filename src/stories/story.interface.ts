export interface BaseStory {
    title: string;
    datePeriod: string;
    characters: Array<string>;
    description: string;
}

export interface Story extends BaseStory {
    id: string;
}