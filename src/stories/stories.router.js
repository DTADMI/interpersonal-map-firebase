"use strict";
/**
 * Required External Modules and Interfaces
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storiesRouter = void 0;
const express_1 = __importDefault(require("express"));
const StoryService = __importStar(require("./stories.service"));
/**
 * Router Definition
 */
exports.storiesRouter = express_1.default.Router();
/**
 * Controller Definitions
 */
// GET stories
exports.storiesRouter.get("/", (req, res) => {
    console.log("starting get all");
    StoryService.findAll().then((stories) => {
        if (!(stories === null || stories === void 0 ? void 0 : stories.length)) {
            console.log("no result");
        }
        res.status(200).send(stories);
    }).catch((error) => {
        console.error("Error getting documents: ", error);
        res.status(500).send(`Error getting documents: ${error}`);
    });
});
// GET /id/?id
exports.storiesRouter.get("/id", (req, res) => {
    const id = req.query.id || "";
    if (!id) {
        res.sendStatus(404);
        return;
    }
    StoryService.find(id.toString()).then((story) => {
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
exports.storiesRouter.post("/", (req, res) => {
    const story = req.body;
    if (!(story === null || story === void 0 ? void 0 : story.title)) {
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
exports.storiesRouter.put("/", (req, res) => {
    const storyUpdate = req.body;
    console.log(`In update! data sent : ${JSON.stringify(storyUpdate)}`);
    if (!(storyUpdate === null || storyUpdate === void 0 ? void 0 : storyUpdate.id) || !(storyUpdate === null || storyUpdate === void 0 ? void 0 : storyUpdate.title)) {
        console.log("Missing data in request body!");
        res.sendStatus(400);
        return;
    }
    StoryService.update(storyUpdate)
        .then((story) => {
        if (!story) {
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
exports.storiesRouter.delete("/:id", (req, res) => {
    /** Front end has to handle the cascade
     => force user to delete character in all stories and relationships
     before being able to delete object
     **/
    const { id } = req.params;
    console.log(`In delete with id : ${id}`);
    if (!id) {
        console.log(`id ${id} not given`);
        res.sendStatus(400);
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
