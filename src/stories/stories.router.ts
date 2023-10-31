/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as StoryService from "./stories.service";
import { BaseStory, Story } from "./story.interface";

/**
 * Router Definition
 */

export const storiesRouter = express.Router();

/**
 * Controller Definitions
 */


// GET stories

storiesRouter.get("/", (req: Request, res: Response) => {
    console.log("starting get all");
    StoryService.findAll().then((stories: Story[])=>{
        if(!stories?.length){
            console.log("no result");
        }
        res.status(200).send(stories);
    }).catch((error) => {
        console.error("Error getting documents: ", error);
        res.status(500).send(`Error getting documents: ${error}`);
    });
});

// GET /id/?id

storiesRouter.get("/id", (req: Request, res: Response) => {
    const id = req.query.id || "";
    if (!id) {
        res.sendStatus(404);
        return;
    }
    StoryService.find(id.toString()).then((story: Story | null) => {
        if (!story) {
            console.log("No such document!");
            res.sendStatus(404);
            return;
        }
        console.log("Story Document data:", story);
        res.status(200).send(story);
    }).catch((error) => {
        console.error("Error getting document: ", error);
        res.status(500).send(`Error getting document: ${error}`);
    });
});

// POST stories

storiesRouter.post("/", (req: Request, res: Response) => {
    const story: BaseStory = req.body;

    if(!story?.title) {
        res.sendStatus(400);
        return;
    }
    console.log(`Creating story ${story}`);
    StoryService.create(story)
        .then((newStory) => {
            console.log("Story Document written with ID: ", newStory.id);
            res.status(201).json(newStory);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            res.status(500).send(`Error adding document: ${error}`);
        });
});

// PUT stories

storiesRouter.put("/", (req: Request, res: Response) => {
    const storyUpdate: Story = req.body;
    console.log(`In update! data sent : ${JSON.stringify(storyUpdate)}`)
    if(!storyUpdate?.id || !storyUpdate?.title) {
        console.log("Missing data in request body!")
        res.sendStatus(400);
        return;
    }
    StoryService.update(storyUpdate)
        .then((story) => {
            if(!story) {
                console.log("No such document!!");
                res.sendStatus(404);
                return;
            }
            console.log("Story Document successfully updated!");
            res.status(200).json(story);
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
            res.status(500).send(`Error writing document: ${error}`);
        });
});

// DELETE :id

storiesRouter.delete("/:id", (req: Request, res: Response) => {
    /** Front end has to handle the cascade
     => force user to delete character in all stories and relationships
     before being able to delete object
     **/
    const { id } = req.params;
    console.log(`In delete with id : ${id}`)
    if (!id) {
        console.log(`id ${id} not given`)
        res.sendStatus(400)
        return;
    }
    StoryService.remove(id).then((id) => {
        console.log("Story Document deleted");
        res.status(204).send(id);
    }).catch((error) => {
        console.log("Error deleting document:", error);
        res.status(500).send(`Error deleting document: ${error}`);
    });
});