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
exports.peopleRouter = void 0;
const express_1 = __importDefault(require("express"));
const PersonService = __importStar(require("./people.service"));
/**
 * Router Definition
 */
exports.peopleRouter = express_1.default.Router();
/**
 * Controller Definitions
 */
// GET people
exports.peopleRouter.get("/", (req, res) => {
    console.log("starting get all");
    PersonService.findAll().then((people) => {
        if (!(people === null || people === void 0 ? void 0 : people.length)) {
            console.log("no result");
        }
        res.status(200).send(people);
    }).catch((error) => {
        console.error("Error getting documents: ", error);
        res.status(500).send(`Error getting documents: ${error}`);
    });
});
// GET /id/?id
exports.peopleRouter.get("/id", (req, res) => {
    const id = req.query.id || "";
    if (!id) {
        res.sendStatus(404);
        return;
    }
    PersonService.find(id.toString()).then((person) => {
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
exports.peopleRouter.post("/", (req, res) => {
    const person = req.body;
    if (!(person === null || person === void 0 ? void 0 : person.names) || !(person === null || person === void 0 ? void 0 : person.names.length)) {
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
exports.peopleRouter.put("/", (req, res) => {
    const personUpdate = req.body;
    console.log(`In update! data sent : ${JSON.stringify(personUpdate)}`);
    if (!(personUpdate === null || personUpdate === void 0 ? void 0 : personUpdate.id)) {
        console.log("Missing data in request body!");
        res.sendStatus(400);
        return;
    }
    PersonService.update(personUpdate)
        .then((person) => {
        if (!person) {
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
exports.peopleRouter.delete("/:id", (req, res) => {
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
    PersonService.remove(id).then((id) => {
        console.log("Person Document deleted");
        res.status(204).send(id);
    }).catch((error) => {
        console.log("Error deleting document:", error);
        res.status(500).send(`Error deleting document: ${error}`);
    });
});
