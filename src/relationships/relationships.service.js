"use strict";
// src/relationships/relationships.service.ts
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
const RelationshipCollection = firebase_1.db.collection("Relationship");
/**
 * Service Methods
 */
const findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return RelationshipCollection.get().then((snapshot) => {
        return snapshot.docs.map((doc) => doc.data());
    });
});
exports.findAll = findAll;
const find = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const docRef = RelationshipCollection.doc(id);
    return docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Relationship Document data:", doc.data());
            return doc.data();
        }
        else {
            console.log("No such document!!!!!");
            return null;
        }
    });
});
exports.find = find;
const create = (newRelationship) => {
    console.log(`Service Creating relationship ${JSON.stringify(newRelationship)}`);
    const idArray = [newRelationship.personSourceId, newRelationship.personTargetId];
    console.log(`Service idArray : ${JSON.stringify(idArray)}`);
    const docId = idArray.join(':');
    console.log(`Service docId : ${docId}`);
    console.log(`Service Joined ids : ${docId}`);
    return RelationshipCollection
        .doc(docId)
        .set(newRelationship)
        .then(() => {
        console.log("Service Relationship Document written with ID: ", docId);
        RelationshipCollection.doc(docId).update({
            id: docId
        }).then(() => {
            console.log("Service Relationship Document id successfully updated!");
        });
        const relationship = Object.assign({}, newRelationship);
        relationship.id = docId;
        return relationship;
    });
};
exports.create = create;
const update = (relationshipUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Update started with : ${JSON.stringify(relationshipUpdate)}`);
    const docRef = RelationshipCollection.doc(relationshipUpdate.id);
    return docRef.set(relationshipUpdate, { merge: true })
        .then(() => {
        console.log("Relationship Document successfully updated!");
        return docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Relationship Document data:", doc.data());
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
    const docRef = RelationshipCollection.doc(id);
    return docRef.delete().then(() => {
        console.log("Relationship Document deleted");
        return id;
    });
});
exports.remove = remove;
