// src/relationships/relationships.service.ts

/**
 * Data Model Interfaces
 */

import {BaseRelationship, Relationship} from "./relationship.interface";
import {db} from "../common/firebase";


/**
 * Firebase Store
 */

const RelationshipCollection = db.collection("Relationship");

/**
 * Service Methods
 */

export const findAll = async (): Promise<Relationship[]> => {
    return RelationshipCollection.get().then((snapshot)=>{
        return snapshot.docs.map((doc) => doc.data() as Relationship);
    })
};

export const findAllInMap = async (mapId: string): Promise<Relationship[]> => {
    console.log(`findAllInMap with owner: ${mapId}`);
    const snapshot = await RelationshipCollection.where('mapId', '==', mapId).get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return [] as Relationship[];
    }
    return snapshot.docs.map((doc) => doc.data() as Relationship);
}

export const find = async (id: string): Promise<Relationship | null> => {
    const docRef = RelationshipCollection.doc(id);
    return docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Relationship Document data:", doc.data());
            return doc.data() as Relationship;
        } else {
            console.log("No such document!!!!!");
            return null;
        }
    })
};

export const create = (newRelationship: BaseRelationship): Promise<Relationship> => {
    console.log(`Creating relationship ${JSON.stringify(newRelationship)}`);
    const docId = [newRelationship.personSourceId, newRelationship.personTargetId].join(':');
    return RelationshipCollection
        .doc(docId)
        .set(newRelationship)
        .then(()=>{
            console.log("Relationship Document written with ID: ", docId);
            RelationshipCollection.doc(docId).update({
                id: docId
            }).then(() => {
                console.log("Relationship Document id successfully updated!");
            });

            const relationship = {...newRelationship} as Relationship;
            relationship.id = docId;
            return relationship;
        });
};

export const update = async (
    relationshipUpdate: Relationship
): Promise<Relationship | null> => {
    console.log(`Update started with : ${JSON.stringify(relationshipUpdate)}`)
    const docRef = RelationshipCollection.doc(relationshipUpdate.id);
    return docRef.set(relationshipUpdate, {merge: true})
        .then(() => {
            console.log("Relationship Document successfully updated!");
            return docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log("Relationship Document data:", doc.data());
                    return doc.data() as Relationship;
                } else {
                    console.log("No such document!!!!!!");
                    return null;
                }
            });
        });
};

export const remove = async (id: string): Promise<string | void> => {
    console.log(`Deletion started for id : ${id}`)
    const docRef = RelationshipCollection.doc(id);
    return docRef.delete().then(() => {
        console.log("Relationship Document deleted");
        return id;
    })
};