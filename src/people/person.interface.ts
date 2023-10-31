export interface BasePerson {
    names: Array<string>;
    familyNames: Array<string>;
    titles: Array<string>;
}

export interface Person extends BasePerson {
    id: string;
}