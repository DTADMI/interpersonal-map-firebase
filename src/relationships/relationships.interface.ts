// src/relationships/relationships.interface.ts

import { Relationship } from "./relationship.interface";

export interface People {
    [key: number]: Relationship;
}