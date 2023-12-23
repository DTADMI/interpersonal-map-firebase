/**
 * Required External Modules
 */

import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import winston from 'winston';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { mapsRouter } from "./maps/maps.router";
import { peopleRouter } from "./people/people.router";
import { relationshipsRouter } from "./relationships/relationships.router";
import { storiesRouter } from "./stories/stories.router";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

/**
 * App Variables
 */

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT, 10);

const app = express();

/**
 *  App Configuration
 */

/**
 *  Rate limiting
 *  */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Use an external store for consistency across multiple server instances.
});

app.use(morgan('combined'));
app.use(limiter);
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/interrelmap/maps", mapsRouter);
app.use("/api/interrelmap/people", peopleRouter);
app.use("/api/interrelmap/relationships", relationshipsRouter);
app.use("/api/interrelmap/stories", storiesRouter);

app.use(errorHandler);

/**
 * Server Activation
 */

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});