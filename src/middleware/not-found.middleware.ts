// src/middleware/not-found.middleware.ts

import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (
    request: Request,
    response: Response,
    next: NextFunction
) => {

    const message = "😅 Resource not found! 🏳️";

    console.error(`The server received the request : ${JSON.stringify(request.path)} with parameters: ${JSON.stringify(request.params)}`);
    console.error(`${JSON.stringify(message)}`);
    response.status(404).send(message);
};