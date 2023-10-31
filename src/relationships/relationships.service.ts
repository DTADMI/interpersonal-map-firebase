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
    return RelationshipCollection.add(newRelationship)
        .then((docRef) => {
            console.log("Relationship Document written with ID: ", docRef.id);
            RelationshipCollection.doc(docRef.id).update({
                id: docRef.id
            }).then(() => {
                console.log("Relationship Document id successfully updated!");
            });
            const relationship = {...newRelationship} as Relationship;
            relationship.id = docRef.id;
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