"use strict";
// src/stories/stories.service.ts
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
const StoryCollection = firebase_1.db.collection("Story");
/**
 * Service Methods
 */
const findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return StoryCollection.get().then((snapshot) => {
        return snapshot.docs.map((doc) => doc.data());
    });
});
exports.findAll = findAll;
const find = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const docRef = StoryCollection.doc(id);
    return docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Story Document data:", doc.data());
            return doc.data();
        }
        else {
            console.log("No such document!!!!!");
            return null;
        }
    });
});
exports.find = find;
const create = (newStory) => {
    console.log(`Creating story ${JSON.stringify(newStory)}`);
    return StoryCollection.add(newStory)
        .then((docRef) => {
        console.log("Story Document written with ID: ", docRef.id);
        StoryCollection.doc(docRef.id).update({
            id: docRef.id
        }).then(() => {
            console.log("Story Document id successfully updated!");
        });
        const story = Object.assign({}, newStory);
        story.id = docRef.id;
        return story;
    });
};
exports.create = create;
const update = (storyUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Update started with : ${JSON.stringify(storyUpdate)}`);
    const docRef = StoryCollection.doc(storyUpdate.id);
    return docRef.set(storyUpdate, { merge: true })
        .then(() => {
        console.log("Story Document successfully updated!");
        return docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Story Document data:", doc.data());
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
    const docRef = StoryCollection.doc(id);
    return docRef.delete().then(() => {
        console.log("Story Document deleted");
        return id;
    });
});
exports.remove = remove;
