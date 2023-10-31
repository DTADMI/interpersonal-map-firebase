// src/stories/stories.service.ts

/**
 * Data Model Interfaces
 */

import {BaseStory, Story} from "./story.interface";
import {db} from "../common/firebase";


/**
 * Firebase Store
 */

const StoryCollection = db.collection("Story");

/**
 * Service Methods
 */

export const findAll = async (): Promise<Story[]> => {
    return StoryCollection.get().then((snapshot)=>{
        return snapshot.docs.map((doc) => doc.data() as Story);
    })
};

export const find = async (id: string): Promise<Story | null> => {
    const docRef = StoryCollection.doc(id);
    return docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Story Document data:", doc.data());
            return doc.data() as Story;
        } else {
            console.log("No such document!!!!!");
            return null;
        }
    })
};

export const create = (newStory: BaseStory): Promise<Story> => {
    console.log(`Creating story ${JSON.stringify(newStory)}`);
    return StoryCollection.add(newStory)
        .then((docRef) => {
            console.log("Story Document written with ID: ", docRef.id);
            StoryCollection.doc(docRef.id).update({
                id: docRef.id
            }).then(() => {
                console.log("Story Document id successfully updated!");
            });
            const story = {...newStory} as Story;
            story.id = docRef.id;
            return story;
        });
};

export const update = async (
    storyUpdate: Story
): Promise<Story | null> => {
    console.log(`Update started with : ${JSON.stringify(storyUpdate)}`)
    const docRef = StoryCollection.doc(storyUpdate.id);
    return docRef.set(storyUpdate, {merge: true})
        .then(() => {
            console.log("Story Document successfully updated!");
            return docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log("Story Document data:", doc.data());
                    return doc.data() as Story;
                } else {
                    console.log("No such document!!!!!!");
                    return null;
                }
            });
        });
};

export const remove = async (id: string): Promise<string | void> => {
    console.log(`Deletion started for id : ${id}`)
    const docRef = StoryCollection.doc(id);
    return docRef.delete().then(() => {
        console.log("Story Document deleted");
        return id;
    })
};