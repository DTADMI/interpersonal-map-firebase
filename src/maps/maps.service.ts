// src/maps/maps.service.ts

/**
 * Data Model Interfaces
 */

import {BaseMap, Map} from "./map.interface";
import {db} from "../common/firebase";


/**
 * Firebase Store
 */

const MapCollection = db.collection("Map");

/**
 * Service Methods
 */

export const findAll = async (): Promise<Map[]> => {
    return MapCollection.get().then((snapshot)=>{
        return snapshot.docs.map((doc) => doc.data() as Map);
    })
};

export const find = async (id: string): Promise<Map | null> => {
    const docRef = MapCollection.doc(id);
    return docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Map Document data:", doc.data());
            return doc.data() as Map;
        } else {
            console.log("No such document!!!!!");
            return null;
        }
    })
};

export const create = (newMap: BaseMap): Promise<Map> => {
    console.log(`Creating map ${newMap}`);
    return MapCollection.add(newMap)
        .then((docRef) => {
            console.log("Map Document written with ID: ", docRef.id);
            MapCollection.doc(docRef.id).update({
                id: docRef.id
            }).then(() => {
                console.log("Map Document id successfully updated!");
            });
            const map = {...newMap} as Map;
            map.id = docRef.id;
            return map;
        });
};

export const update = async (
    mapUpdate: Map
): Promise<Map | null> => {
    console.log(`Update started with : ${JSON.stringify(mapUpdate)}`)
    const docRef = MapCollection.doc(mapUpdate.id);
    return docRef.set(mapUpdate, {merge: true})
        .then(() => {
            console.log("Map Document successfully updated!");
            return docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log("Map Document data:", doc.data());
                    return doc.data() as Map;
                } else {
                    console.log("No such document!!!!!!");
                    return null;
                }
            });
        });
};

export const updatePeople = async (
    mapUpdate: Map
): Promise<Map | null> => {
    const docRef = MapCollection.doc(mapUpdate.id);
    const dataUpdate = {
        people: mapUpdate.people
    };
    return docRef.set(dataUpdate, {merge: true})
        .then(() => {
            console.log("Map Document successfully updated!");
            return docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log("Map Document data:", doc.data());
                    return doc.data() as Map;
                } else {
                    console.log("No such document!!!!!!!");
                    return null;
                }
            });
        });
};


export const remove = async (id: string): Promise<string | void> => {
    console.log(`Deletion started for id : ${id}`)
    const docRef = MapCollection.doc(id);
    return docRef.delete().then(() => {
        console.log("Map Document deleted");
        return id;
    })
};