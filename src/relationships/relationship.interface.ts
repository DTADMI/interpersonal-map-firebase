export interface BaseRelationship {
    personSourceId: string;
    personTargetId: string;
    relationType?: string;
    description?: string;
    mapId: string;
}

export interface Relationship extends BaseRelationship {
    id: string;
}