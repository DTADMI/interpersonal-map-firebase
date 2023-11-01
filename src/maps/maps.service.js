"use strict";
// src/maps/maps.service.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.updatePeople = exports.update = exports.create = exports.find = exports.findAllFromOwner = exports.findAll = void 0;
const firebase_1 = require("../common/firebase");
/**
 * Firebase Store
 */
const MapCollection = firebase_1.db.collection("Map");
/**
 * Service Methods
 */
const findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return MapCollection.get().then((snapshot) => {
        return snapshot.docs.map((doc) => doc.data());
    });
});
exports.findAll = findAll;
const findAllFromOwner = (owner) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`findAllFromOwner with owner: ${owner}`);
    const snapshot = yield MapCollection.where('owner', '==', owner).get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return [];
    }
    return snapshot.docs.map((doc) => doc.data());
});
exports.findAllFromOwner = findAllFromOwner;
const find = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const docRef = MapCollection.doc(id);
    return docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Map Document data:", doc.data());
            return doc.data();
        }
        else {
            console.log("No such document!!!!!");
            return null;
        }
    });
});
exports.find = find;
const create = (newMap) => {
    console.log(`Creating map ${JSON.stringify(newMap)}`);
    return MapCollection.add(newMap)
        .then((docRef) => {
        console.log("Map Document written with ID: ", docRef.id);
        MapCollection.doc(docRef.id).update({
            id: docRef.id
        }).then(() => {
            console.log("Map Document id successfully updated!");
        });
        const map = Object.assign({}, newMap);
        map.id = docRef.id;
        return map;
    });
};
exports.create = create;
const update = (mapUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Update started with : ${JSON.stringify(mapUpdate)}`);
    const docRef = MapCollection.doc(mapUpdate.id);
    return docRef.set(mapUpdate, { merge: true })
        .then(() => {
        console.log("Map Document successfully updated!");
        return docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Map Document data:", doc.data());
                return doc.data();
            }
            else {
                console.log("No such document!!!!!!");
                return null;
            }
        });
    });
});
exports.update = update;
const updatePeople = (mapUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    const docRef = MapCollection.doc(mapUpdate.id);
    const dataUpdate = {
        people: mapUpdate.people
    };
    return docRef.set(dataUpdate, { merge: true })
        .then(() => {
        console.log("Map Document successfully updated!");
        return docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Map Document data:", doc.data());
                return doc.data();
            }
            else {
                console.log("No such document!!!!!!!");
                return null;
            }
        });
    });
});
exports.updatePeople = updatePeople;
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Deletion started for id : ${id}`);
    const docRef = MapCollection.doc(id);
    return docRef.delete().then(() => {
        console.log("Map Document deleted");
        return id;
    });
});
exports.remove = remove;
