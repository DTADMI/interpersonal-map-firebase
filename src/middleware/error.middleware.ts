// src/middleware/error.middleware.ts

import HttpException from "../common/http-exception";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
    error: HttpException,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const status = (error.statusCode ?? error.status) ?? 500;
    if(next){
        next(error);
    }
    console.error(`😱 An error occurred during the request 💀: ${JSON.stringify(error)}`);
    response.status(status).send(error);
};