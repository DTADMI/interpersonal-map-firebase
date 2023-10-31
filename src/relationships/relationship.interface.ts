export interface BaseRelationship {
    personSourceId: string;
    personTargetId: string;
    type: string;
    description: string;
}

export interface Relationship extends BaseRelationship {
    id: string;
}