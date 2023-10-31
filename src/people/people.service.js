"use strict";
// src/people/people.service.ts
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
exports.remove = exports.update = exports.create = exports.find = exports.findAll = void 0;
const firebase_1 = require("../common/firebase");
/**
 * Firebase Store
 */
const PersonCollection = firebase_1.db.collection("Person");
/**
 * Service Methods
 */
const findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return PersonCollection.get().then((snapshot) => {
        return snapshot.docs.map((doc) => doc.data());
    });
});
exports.findAll = findAll;
const find = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const docRef = PersonCollection.doc(id);
    return docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Person Document data:", doc.data());
            return doc.data();
        }
        else {
            console.log("No such document!!!!!");
            return null;
        }
    });
});
exports.find = find;
const create = (newPerson) => {
    console.log(`Creating person ${JSON.stringify(newPerson)}`);
    return PersonCollection.add(newPerson)
        .then((docRef) => {
        console.log("Person Document written with ID: ", docRef.id);
        PersonCollection.doc(docRef.id).update({
            id: docRef.id
        }).then(() => {
            console.log("Person Document id successfully updated!");
        });
        const person = Object.assign({}, newPerson);
        person.id = docRef.id;
        return person;
    });
};
exports.create = create;
const update = (personUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Update started with : ${JSON.stringify(personUpdate)}`);
    const docRef = PersonCollection.doc(personUpdate.id);
    return docRef.set(personUpdate, { merge: true })
        .then(() => {
        console.log("Person Document successfully updated!");
        return docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Person Document data:", doc.data());
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
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Deletion started for id : ${id}`);
    const docRef = PersonCollection.doc(id);
    return docRef.delete().then(() => {
        console.log("Person Document deleted");
        return id;
    });
});
exports.remove = remove;
