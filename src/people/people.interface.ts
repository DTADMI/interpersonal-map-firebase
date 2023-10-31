// src/people/people.interface.ts

import { Person } from "./person.interface";

export interface People {
    [key: number]: Person;
}