// src/people/people.service.ts

/**
 * Data Model Interfaces
 */

import {BasePerson, Person} from "./person.interface";
import {db} from "../common/firebase";


/**
 * Firebase Store
 */

const PersonCollection = db.collection("Person");

/**
 * Service Methods
 */

export const findAll = async (): Promise<Person[]> => {
    return PersonCollection.get().then((snapshot)=>{
        return snapshot.docs.map((doc) => doc.data() as Person);
    })
};

export const find = async (id: string): Promise<Person | null> => {
    const docRef = PersonCollection.doc(id);
    return docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Person Document data:", doc.data());
            return doc.data() as Person;
        } else {
            console.log("No such document!!!!!");
            return null;
        }
    })
};

export const create = (newPerson: BasePerson): Promise<Person> => {
    console.log(`Creating person ${JSON.stringify(newPerson)}`);
    return PersonCollection.add(newPerson)
        .then((docRef) => {
            console.log("Person Document written with ID: ", docRef.id);
            PersonCollection.doc(docRef.id).update({
                id: docRef.id
            }).then(() => {
                console.log("Person Document id successfully updated!");
            });
            const person = {...newPerson} as Person;
            person.id = docRef.id;
            return person;
        });
};

export const update = async (
    personUpdate: Person
): Promise<Person | null> => {
    console.log(`Update started with : ${JSON.stringify(personUpdate)}`)
    const docRef = PersonCollection.doc(personUpdate.id);
    return docRef.set(personUpdate, {merge: true})
        .then(() => {
            console.log("Person Document successfully updated!");
            return docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log("Person Document data:", doc.data());
                    return doc.data() as Person;
                } else {
                    console.log("No such document!!!!!!");
                    return null;
                }
            });
        });
};

export const remove = async (id: string): Promise<string | void> => {
    console.log(`Deletion started for id : ${id}`)
    const docRef = PersonCollection.doc(id);
    return docRef.delete().then(() => {
        console.log("Person Document deleted");
        return id;
    })
};