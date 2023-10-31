/**
 * Required External Modules
 */

import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { mapsRouter } from "./maps/maps.router";
import { peopleRouter } from "./people/people.router";
import { relationshipsRouter } from "./relationships/relationships.router";
import { storiesRouter } from "./stories/stories.router";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";


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

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/interrelmap/maps", mapsRouter);
app.use("/api/interrelmap/people", peopleRouter);
app.use("/api/interrelmap/relationships", relationshipsRouter);
app.use("/api/interrelmap/stories", storiesRouter);

app.use(errorHandler);
app.use(notFoundHandler);

/**
 * Server Activation
 */

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});