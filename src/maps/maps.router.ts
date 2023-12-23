/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as MapService from "./maps.service";
import { BaseMap, Map } from "./map.interface";
import HttpException from "../common/http-exception";
import {tryCatch} from "../utils/tryCatch";

/**
 * Router Definition
 */

export const mapsRouter = express.Router();

const NOT_FOUND_MESSAGE = "😅 Resource not found! 🏳️";
let errorMessage: string;

/**
 * Controller Definitions
 */


// GET maps

mapsRouter.get(
    "/",
    tryCatch((req: Request, res: Response) => {
        console.log("starting get all");
        const page=req.query?.page ?? "";
        const limit=req.query?.limit ?? "";
        MapService.findAll().then((maps: Map[])=> {
            if(!maps?.length){
                console.log("no result");
            }
            if(page && limit) {
                console.log(`Getting sliced maps with ${limit} elements starting at page ${page}`);
                const pageInt = Math.floor(parseInt(page.toString()));
                const limitInt = Math.floor(parseInt(limit.toString()));
                const startIndex = (pageInt-1)*limitInt;
                const endIndex = (pageInt)*limitInt;
                console.log(`Getting sliced maps from ${startIndex} to ${endIndex} excluded`);

                maps = maps.slice(startIndex, endIndex);
            }
            res.set('Cache-Control', 'public, max-age=120, s-maxage=300');
            res.status(200).send(maps);
        }).catch((error) => {
            errorMessage = "Error getting document ";
            console.error(errorMessage, error);
            throw new HttpException(errorMessage, JSON.stringify(error));
        });
    })
);

// GET /id/?id

mapsRouter.get(
    "/id",
    tryCatch((req: Request, res: Response) => {
        const id = req.query.id ?? "";
        if (!id) {
            errorMessage = `id parameter not provided`;
            console.log(errorMessage);
            throw new HttpException(errorMessage, null, 400);
        }
        MapService.findById(id.toString()).then((map: Map | null) => {
            if (!map) {
                console.log(NOT_FOUND_MESSAGE);
                throw new HttpException(NOT_FOUND_MESSAGE, null, 404);
            }
            console.log("Map Document data:", map);
            res.set('Cache-Control', 'public, max-age=60, s-maxage=120');
            res.status(200).send(map);
        }).catch((error) => {
            errorMessage = "Error getting document ";
            console.error(errorMessage, error);
            throw new HttpException(errorMessage, JSON.stringify(error));
        });
    })
);

// GET /name/?name

mapsRouter.get(
    "/name",
    tryCatch((req: Request, res: Response) => {
        let name = req.query?.name ?? "";
        console.log(`Starting get map by name with name : ${name}`);
        if (!name) {
            errorMessage = `name parameter not provided`;
            console.log(errorMessage);
            throw new HttpException(errorMessage, null, 400);
        }
        name = name.toString();
        MapService.findByName(name).then((map: Map | null) => {
            if(!map){
                console.log(NOT_FOUND_MESSAGE);
                throw new HttpException(NOT_FOUND_MESSAGE, null, 404);
            }
            console.log("Map Document data:", JSON.stringify(map));
            res.set('Cache-Control', 'public, max-age=60, s-maxage=120');
            res.status(200).send(map);
        }).catch((error) => {
            errorMessage = "Error getting document ";
            console.error(errorMessage, error);
            throw new HttpException(errorMessage, JSON.stringify(error));
        });
    })
);

// POST maps

mapsRouter.post(
    "/",
    tryCatch((req: Request, res: Response) => {
        const map: BaseMap = req.body;

        if(!map?.name) {
            throw new HttpException("map parameter must contain a name", null, 400);
        }
        console.log(`Creating map ${map}`);
        MapService.create(map)
            .then((newMap) => {
                console.log("Map Document written with ID: ", newMap.id);
                res.status(201).json(newMap);
            })
            .catch((error) => {
                errorMessage = "Error adding document ";
                console.error(errorMessage, error);
                throw new HttpException(errorMessage, JSON.stringify(error));
            });
    })
);

// POST maps/owned

mapsRouter.post(
    "/owned",
    tryCatch((req: Request, res: Response) => {
        const { owner } = req.body;
        const page=req.query?.page ?? "";
        const limit=req.query?.limit ?? "";

        if(!owner) {
            errorMessage = "User parameter missing";
            console.log(errorMessage);
            throw new HttpException(errorMessage,null, 400);
        }
        console.log(`Getting all owned maps from ${owner}`);
        MapService.findAllFromOwner(owner)
            .then((maps: Map[]) => {
                if(!maps?.length){
                    console.log("no result");
                }
                if(page && limit) {
                    console.log(`Getting sliced maps with ${limit} elements starting at page ${page}`);
                    const pageInt = Math.floor(parseInt(page.toString()));
                    const limitInt = Math.floor(parseInt(limit.toString()));
                    const startIndex = (pageInt-1)*limitInt;
                    const endIndex = (pageInt)*limitInt;
                    console.log(`Getting sliced maps from ${startIndex} to ${endIndex} excluded`);

                    maps = maps.slice(startIndex, endIndex);
                }
                res.set('Cache-Control', 'public, max-age=120, s-maxage=300');
                res.status(200).send(maps);
            })
            .catch((error) => {
                errorMessage = "Error while getting all owned document "
                console.error(errorMessage, error);
                throw new HttpException(errorMessage, JSON.stringify(error));
            });
    })
);

// PUT maps

mapsRouter.put(
    "/",
    tryCatch((req: Request, res: Response) => {
        const mapUpdate: Map = req.body;
        console.log(`In update! data sent : ${JSON.stringify(mapUpdate)}`);
        if(!mapUpdate?.name || !mapUpdate?.id) {
            errorMessage = "Missing data in request body!";
            console.log(errorMessage);
            throw new HttpException(errorMessage, null, 400);
        }
        MapService.update(mapUpdate)
            .then((map) => {
                if(!map) {
                    console.log(NOT_FOUND_MESSAGE);
                    throw new HttpException(NOT_FOUND_MESSAGE, null, 404);
                }
                console.log("Map Document successfully updated!");
                res.set('Cache-Control', 'public, max-age=60, s-maxage=120');
                res.status(200).json(map);
            })
            .catch((error) => {
                errorMessage = "Error writing document ";
                console.error(errorMessage, error);
                throw new HttpException(errorMessage, JSON.stringify(error));
            });
    })
);

// PUT people

mapsRouter.put(
    "/people",
    tryCatch((req: Request, res: Response) => {
        const mapUpdate: Map = req.body;
        if(!mapUpdate?.name || !mapUpdate?.id || !mapUpdate?.people) {
            errorMessage = "Missing data in request body!";
            console.log(errorMessage);
            throw new HttpException(errorMessage, null, 400);
        }
        MapService.updatePeople(mapUpdate)
            .then((map) => {
                if(!map) {
                    console.log(NOT_FOUND_MESSAGE);
                    throw new HttpException(NOT_FOUND_MESSAGE, null, 404);
                }
                console.log("Map Document successfully updated!");
                res.set('Cache-Control', 'public, max-age=60, s-maxage=120');
                res.status(200).json(map);
            })
            .catch((error) => {
                errorMessage = "Error writing document ";
                console.error(errorMessage, error);
                throw new HttpException(errorMessage, JSON.stringify(error));
            });
    })
);

// DELETE :id

mapsRouter.delete(
    "/:id",
    tryCatch((req: Request, res: Response) => {
        const { id } = req.params;
        console.log(`In delete with id : ${id}`)
        if (!id) {
            errorMessage = `id parameter not provided`;
            console.log(errorMessage);
            throw new HttpException(errorMessage, null, 400);
        }
        MapService.remove(id).then((id) => {
            console.log("Map Document deleted");
            res.status(204).send(id);
        }).catch((error) => {
            errorMessage = "Error deleting document ";
            console.log(errorMessage, error);
            throw new HttpException(errorMessage, JSON.stringify(error));
        });
    })
);