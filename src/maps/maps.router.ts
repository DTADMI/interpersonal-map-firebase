/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as MapService from "./maps.service";
import { BaseMap, Map } from "./map.interface";

/**
 * Router Definition
 */

export const mapsRouter = express.Router();

/**
 * Controller Definitions
 */


// GET maps

mapsRouter.get("/", (req: Request, res: Response) => {
    console.log("starting get all");
    MapService.findAll().then((maps: Map[])=>{
        if(!maps?.length){
            console.log("no result");
        }
        res.status(200).send(maps);
    }).catch((error) => {
        console.error("Error getting documents: ", error);
        res.status(500).send(`Error getting documents: ${error}`);
    });
});

// GET /id/?id

mapsRouter.get("/id", (req: Request, res: Response) => {
    const id = req.query.id ?? "";
    if (!id) {
        res.sendStatus(404);
        return;
    }
    MapService.find(id.toString()).then((map: Map | null) => {
        if (!map) {
            console.log("No such document!");
            res.sendStatus(404);
            return;
        }
        console.log("Map Document data:", map);
        res.status(200).send(map);
    }).catch((error) => {
        console.error("Error getting document: ", error);
        res.status(500).send(`Error getting document: ${error}`);
    });
});

// GET /name/?name

mapsRouter.get("/name", (req: Request, res: Response) => {
    let name = req.query.name ?? "";
    console.log(`Starting get map by name with name : ${name}`);
    if (!name) {
        console.log("Name not provided!")
        res.sendStatus(400);
        return;
    }
    name = name.toString();
    MapService.findAll().then((maps) => {
        if(!maps?.length){
            console.log("Table empty");
            res.sendStatus(404);
            return;
        }
        console.log(`Table not empty: looking for map with name ${name}`);
        const map = maps.find((elt) => name === elt.name);
        if(!map) {
            console.log("No such document!!!");
            res.sendStatus(404);
            return;
        }
        console.log("Map Document data:", JSON.stringify(map));
        res.status(200).send(map);
    }).catch((error) => {
        console.error("Error getting document: ", error);
        res.status(500).send(`Error getting document: ${error}`);
    });
});

// POST maps

mapsRouter.post("/", (req: Request, res: Response) => {
    const map: BaseMap = req.body;

    if(!map?.name) {
        res.sendStatus(400);
        return;
    }
    console.log(`Creating map ${map}`);
    MapService.create(map)
        .then((newMap) => {
            console.log("Map Document written with ID: ", newMap.id);
            res.status(201).json(newMap);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            res.status(500).send(`Error adding document: ${error}`);
        });
});

// POST maps/owned

mapsRouter.post("/owned", (req: Request, res: Response) => {
    const { owner } = req.body;

    if(!owner) {
        console.log("Owner missing")
        res.sendStatus(400);
        return;
    }
    console.log(`Getting all owned maps from ${owner}`);
    MapService.findAllFromOwner(owner)
        .then((maps: Map[]) => {
            if(!maps?.length){
                console.log("no result");
            }
            res.status(200).send(maps);
        })
        .catch((error) => {
            console.error("Error while getting all owned document: ", error);
            res.status(500).send(`Error while getting all owned document: ${error}`);
        });
});

// PUT maps

mapsRouter.put("/", (req: Request, res: Response) => {
    const mapUpdate: Map = req.body;
    console.log(`In update! data sent : ${JSON.stringify(mapUpdate)}`)
    if(!mapUpdate?.name || !mapUpdate?.id) {
        console.log("Missing data in request body!")
        res.sendStatus(400);
        return;
    }
    MapService.update(mapUpdate)
        .then((map) => {
            if(!map) {
                console.log("No such document!!");
                res.sendStatus(404);
                return;
            }
            console.log("Map Document successfully updated!");
            res.status(200).json(map);
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
            res.status(500).send(`Error writing document: ${error}`);
        });
});

// PUT people

mapsRouter.put("/people", (req: Request, res: Response) => {
    const mapUpdate: Map = req.body;
    if(!mapUpdate?.name || !mapUpdate?.id || !mapUpdate?.people) {
        res.sendStatus(400);
        return;
    }
    MapService.updatePeople(mapUpdate)
        .then((map) => {
            if(!map) {
                console.log("No such document!!!!");
                res.sendStatus(404);
                return;
            }
            console.log("Map Document successfully updated!");
            res.status(200).json(map);
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
            res.status(500).send(`Error writing document: ${error}`);
        });
});

// DELETE :id

mapsRouter.delete("/:id", (req: Request, res: Response) => {
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
    MapService.remove(id).then((id) => {
        console.log("Map Document deleted");
        res.status(204).send(id);
    }).catch((error) => {
        console.log("Error deleting document:", error);
        res.status(500).send(`Error deleting document: ${error}`);
    });
});