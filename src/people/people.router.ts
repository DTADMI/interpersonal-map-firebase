/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as PersonService from "./people.service";
import { BasePerson, Person } from "./person.interface";

/**
 * Router Definition
 */

export const peopleRouter = express.Router();

/**
 * Controller Definitions
 */


// GET people

peopleRouter.get("/", (req: Request, res: Response) => {
    console.log("starting get all");
    PersonService.findAll().then((people: Person[])=>{
        if(!people?.length){
            console.log("no result");
        }
        res.status(200).send(people);
    }).catch((error) => {
        console.error("Error getting documents: ", error);
        res.status(500).send(`Error getting documents: ${error}`);
    });
});

// GET /id/?id

peopleRouter.get("/id", (req: Request, res: Response) => {
    const id = req.query.id || "";
    if (!id) {
        res.sendStatus(404);
        return;
    }
    PersonService.find(id.toString()).then((person: Person | null) => {
        if (!person) {
            console.log("No such document!");
            res.sendStatus(404);
            return;
        }
        console.log("Person Document data:", person);
        res.status(200).send(person);
    }).catch((error) => {
        console.error("Error getting document: ", error);
        res.status(500).send(`Error getting document: ${error}`);
    });
});

// POST people

peopleRouter.post("/", (req: Request, res: Response) => {
    const person: BasePerson = req.body;

    if(!person?.names || !person?.names.length) {
        res.sendStatus(400);
        return;
    }
    console.log(`Creating person ${person}`);
    PersonService.create(person)
        .then((newPerson) => {
            console.log("Person Document written with ID: ", newPerson.id);
            res.status(201).json(newPerson);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            res.status(500).send(`Error adding document: ${error}`);
        });
});

// PUT people

peopleRouter.put("/", (req: Request, res: Response) => {
    const personUpdate: Person = req.body;
    console.log(`In update! data sent : ${JSON.stringify(personUpdate)}`)
    if(!personUpdate?.id) {
        console.log("Missing data in request body!")
        res.sendStatus(400);
        return;
    }
    PersonService.update(personUpdate)
        .then((person) => {
            if(!person) {
                console.log("No such document!!");
                res.sendStatus(404);
                return;
            }
            console.log("Person Document successfully updated!");
            res.status(200).json(person);
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
            res.status(500).send(`Error writing document: ${error}`);
        });
});

// DELETE :id

peopleRouter.delete("/:id", (req: Request, res: Response) => {
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
    PersonService.remove(id).then((id) => {
        console.log("Person Document deleted");
        res.status(204).send(id);
    }).catch((error) => {
        console.log("Error deleting document:", error);
        res.status(500).send(`Error deleting document: ${error}`);
    });
});