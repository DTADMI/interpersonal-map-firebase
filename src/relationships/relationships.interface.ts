// src/relationships/relationships.interface.ts

import { Relationship } from "./relationship.interface";

export interface Relationships {
    [key: number]: Relationship;
}