/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as RelationshipService from "./relationships.service";
import { BaseRelationship, Relationship } from "./relationship.interface";

/**
 * Router Definition
 */

export const relationshipsRouter = express.Router();

/**
 * Controller Definitions
 */


// GET relationships

relationshipsRouter.get("/", (req: Request, res: Response) => {
    console.log("starting get all");
    RelationshipService.findAll().then((relationships: Relationship[])=>{
        if(!relationships?.length){
            console.log("no result");
        }
        res.status(200).send(relationships);
    }).catch((error) => {
        console.error("Error getting documents: ", error);
        res.status(500).send(`Error getting documents: ${error}`);
    });
});

// GET /id/?id

relationshipsRouter.get("/id", (req: Request, res: Response) => {
    const id = req.query.id ?? "";
    if (!id) {
        res.sendStatus(404);
        return;
    }
    RelationshipService.find(id.toString()).then((relationship: Relationship | null) => {
        if (!relationship) {
            console.log("No such document!");
            res.sendStatus(404);
            return;
        }
        console.log("Relationship Document data:", relationship);
        res.status(200).send(relationship);
    }).catch((error) => {
        console.error("Error getting document: ", error);
        res.status(500).send(`Error getting document: ${error}`);
    });
});

// POST relationships

relationshipsRouter.post("/", (req: Request, res: Response) => {
    console.log(`Creation relationship with body : ${JSON.stringify(req.body)}`);
    const relationship: BaseRelationship = req.body;
    console.log(`Creation relationship with : ${JSON.stringify(relationship)}`);

    if(!relationship?.personSourceId || !relationship?.personTargetId) {
        console.log("BAD REQUEST");
        res.sendStatus(400);
        return;
    }
    console.log(`Creating relationship ${JSON.stringify(relationship)}`);
    RelationshipService.create(relationship)
        .then((newRelationship) => {
            console.log("Relationship Document written with ID: ", newRelationship.id);
            res.status(201).json(newRelationship);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            res.status(500).send(`Error adding document: ${error}`);
        });
});

// PUT relationships

relationshipsRouter.put("/", (req: Request, res: Response) => {
    const relationshipUpdate: Relationship = req.body;
    console.log(`In update! data sent : ${JSON.stringify(relationshipUpdate)}`)
    if(!relationshipUpdate?.personSourceId || !relationshipUpdate?.personTargetId || !relationshipUpdate?.id) {
        console.log("Missing data in request body!")
        res.sendStatus(400);
        return;
    }
    RelationshipService.update(relationshipUpdate)
        .then((relationship) => {
            if(!relationship) {
                console.log("No such document!!");
                res.sendStatus(404);
                return;
            }
            console.log("Relationship Document successfully updated!");
            res.status(200).json(relationship);
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
            res.status(500).send(`Error writing document: ${error}`);
        });
});

// DELETE :id

relationshipsRouter.delete("/:id", (req: Request, res: Response) => {
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
    RelationshipService.remove(id).then((id) => {
        console.log("Relationship Document deleted");
        res.status(204).send(id);
    }).catch((error) => {
        console.log("Error deleting document:", error);
        res.status(500).send(`Error deleting document: ${error}`);
    });
});