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
exports.mapsRouter = void 0;
const express_1 = __importDefault(require("express"));
const MapService = __importStar(require("./maps.service"));
/**
 * Router Definition
 */
exports.mapsRouter = express_1.default.Router();
/**
 * Controller Definitions
 */
// GET maps
exports.mapsRouter.get("/", (req, res) => {
    console.log("starting get all");
    MapService.findAll().then((maps) => {
        if (!(maps === null || maps === void 0 ? void 0 : maps.length)) {
            console.log("no result");
        }
        res.status(200).send(maps);
    }).catch((error) => {
        console.error("Error getting documents: ", error);
        res.status(500).send(`Error getting documents: ${error}`);
    });
});
// GET /id/?id
exports.mapsRouter.get("/id", (req, res) => {
    const id = req.query.id || "";
    if (!id) {
        res.sendStatus(404);
        return;
    }
    MapService.find(id.toString()).then((map) => {
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
exports.mapsRouter.get("/name", (req, res) => {
    let name = req.query.name || "";
    console.log(`Starting get map by name with name : ${name}`);
    if (!name) {
        console.log("Name not provided!");
        res.sendStatus(400);
        return;
    }
    name = name.toString();
    MapService.findAll().then((maps) => {
        if (!(maps === null || maps === void 0 ? void 0 : maps.length)) {
            console.log("Table empty");
            res.sendStatus(404);
            return;
        }
        console.log(`Table not empty: looking for map with name ${name}`);
        const map = maps.find((elt) => name === elt.name);
        if (!map) {
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
exports.mapsRouter.post("/", (req, res) => {
    const map = req.body;
    if (!(map === null || map === void 0 ? void 0 : map.name)) {
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
exports.mapsRouter.post("/owned", (req, res) => {
    const { owner } = req.body;
    if (!owner) {
        console.log("Owner missing");
        res.sendStatus(400);
        return;
    }
    console.log(`Getting all owned maps from ${owner}`);
    MapService.findAllFromOwner(owner)
        .then((maps) => {
        if (!(maps === null || maps === void 0 ? void 0 : maps.length)) {
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
exports.mapsRouter.put("/", (req, res) => {
    const mapUpdate = req.body;
    console.log(`In update! data sent : ${JSON.stringify(mapUpdate)}`);
    if (!(mapUpdate === null || mapUpdate === void 0 ? void 0 : mapUpdate.name) || !(mapUpdate === null || mapUpdate === void 0 ? void 0 : mapUpdate.id)) {
        console.log("Missing data in request body!");
        res.sendStatus(400);
        return;
    }
    MapService.update(mapUpdate)
        .then((map) => {
        if (!map) {
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
exports.mapsRouter.put("/people", (req, res) => {
    const mapUpdate = req.body;
    if (!(mapUpdate === null || mapUpdate === void 0 ? void 0 : mapUpdate.name) || !(mapUpdate === null || mapUpdate === void 0 ? void 0 : mapUpdate.id) || !(mapUpdate === null || mapUpdate === void 0 ? void 0 : mapUpdate.people)) {
        res.sendStatus(400);
        return;
    }
    MapService.updatePeople(mapUpdate)
        .then((map) => {
        if (!map) {
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
exports.mapsRouter.delete("/:id", (req, res) => {
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
    MapService.remove(id).then((id) => {
        console.log("Map Document deleted");
        res.status(204).send(id);
    }).catch((error) => {
        console.log("Error deleting document:", error);
        res.status(500).send(`Error deleting document: ${error}`);
    });
});
