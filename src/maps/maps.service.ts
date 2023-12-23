// src/maps/maps.service.ts

/**
 * Data Model Interfaces
 */

import {BaseMap, Map} from "./map.interface";
import {db} from "../common/firebase";
import {cache, CACHE_KEYS, clearAllCache} from "../common/cache.service";


/**
 * Firebase Store
 */

const MapCollection = db.collection("Map");

/**
 * Service Methods
 */

export const findAll = async (): Promise<Map[]> => {
    const cacheKey = CACHE_KEYS.MAPS.ALL_MAPS;
    if(cache.has(cacheKey)){
        return Promise.resolve(cache.get<Map[]>(cacheKey) as Map[]);
    }
    
    return MapCollection.orderBy("owner", 'asc').startAfter("").limit(0).get().then((snapshot)=>{
        return snapshot.docs.map((doc) => doc.data() as Map);
    })
};

export const findAllFromOwner = async (owner: string): Promise<Map[]> => {
    console.log(`findAllFromOwner with owner: ${owner}`);
    const cacheKey = CACHE_KEYS.MAPS.USER_MAPS;
    if(cache.has(cacheKey)){
        return Promise.resolve(cache.get<Map[]>(cacheKey) as Map[]);
    }

    const snapshot = await MapCollection.where('owner', '==', owner).get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return [] as Map[];
    }
    return snapshot.docs.map((doc) => doc.data() as Map);
}

export const findById = async (id: string): Promise<Map | null> => {
    const cacheKey = CACHE_KEYS.MAPS.ALL_MAPS;
    if(cache.has(cacheKey)) {
        const maps = cache.get<Map[]>(cacheKey) as Map[];
        return Promise.resolve(maps?.find(map => map.id === id) ?? null);
    }
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

export const findByName = async (name: string): Promise<Map | null> => {
    const cacheKey = CACHE_KEYS.MAPS.ALL_MAPS;
    if(cache.has(cacheKey)) {
        const maps = cache.get<Map[]>(cacheKey) as Map[];
        return Promise.resolve(maps?.find(map => map.name === name) ?? null);
    }

    return MapCollection.where('name', '==', name).get().then((snapshot)=>{
        return snapshot.docs.map((doc) => {
            return doc.data() as Map;
        }).find((map: Map) => map.name === name) ?? null;
    })
};

export const create = (newMap: BaseMap): Promise<Map> => {
    console.log(`Creating map ${JSON.stringify(newMap)}`);
    return MapCollection.add(newMap)
        .then((docRef) => {
            console.log("Map Document written with ID: ", docRef.id);
            clearAllCache();
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
            clearAllCache();
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
            clearAllCache();
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
        clearAllCache();
        return id;
    })
};