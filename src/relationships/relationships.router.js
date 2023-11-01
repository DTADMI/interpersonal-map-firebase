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
exports.relationshipsRouter = void 0;
const express_1 = __importDefault(require("express"));
const RelationshipService = __importStar(require("./relationships.service"));
/**
 * Router Definition
 */
exports.relationshipsRouter = express_1.default.Router();
/**
 * Controller Definitions
 */
// GET relationships
exports.relationshipsRouter.get("/", (req, res) => {
    console.log("starting get all");
    RelationshipService.findAll().then((relationships) => {
        if (!(relationships === null || relationships === void 0 ? void 0 : relationships.length)) {
            console.log("no result");
        }
        res.status(200).send(relationships);
    }).catch((error) => {
        console.error("Error getting documents: ", error);
        res.status(500).send(`Error getting documents: ${error}`);
    });
});
// GET /id/?id
exports.relationshipsRouter.get("/id", (req, res) => {
    const id = req.query.id || "";
    if (!id) {
        res.sendStatus(404);
        return;
    }
    RelationshipService.find(id.toString()).then((relationship) => {
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
exports.relationshipsRouter.post("/", (req, res) => {
    console.log(`Creation relationship with body : ${JSON.stringify(req.body)}`);
    const relationship = req.body;
    console.log(`Creation relationship with : ${JSON.stringify(relationship)}`);
    if (!(relationship === null || relationship === void 0 ? void 0 : relationship.personSourceId) || !(relationship === null || relationship === void 0 ? void 0 : relationship.personTargetId)) {
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
exports.relationshipsRouter.put("/", (req, res) => {
    const relationshipUpdate = req.body;
    console.log(`In update! data sent : ${JSON.stringify(relationshipUpdate)}`);
    if (!(relationshipUpdate === null || relationshipUpdate === void 0 ? void 0 : relationshipUpdate.personSourceId) || !(relationshipUpdate === null || relationshipUpdate === void 0 ? void 0 : relationshipUpdate.personTargetId) || !(relationshipUpdate === null || relationshipUpdate === void 0 ? void 0 : relationshipUpdate.id)) {
        console.log("Missing data in request body!");
        res.sendStatus(400);
        return;
    }
    RelationshipService.update(relationshipUpdate)
        .then((relationship) => {
        if (!relationship) {
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
exports.relationshipsRouter.delete("/:id", (req, res) => {
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
    RelationshipService.remove(id).then((id) => {
        console.log("Relationship Document deleted");
        res.status(204).send(id);
    }).catch((error) => {
        console.log("Error deleting document:", error);
        res.status(500).send(`Error deleting document: ${error}`);
    });
});
