import express from "express";
import {bodyParserMiddleware} from "../middleware/bodyParser.middleware";
import {BodyParserOptionsInterface} from "../interfaces/bodyParserOptions.interface";

/**
 *
 * @param options
 *
 * Use by this: jsonBodyParserType({ type: 'application/vnd.custom-type' })
 *
 * It returns the middleware (older versions returned nothing, which made it unusable).
 * Bodies larger than `options.limit` bytes (default 100 KiB) are rejected with 413.
 *
 * in express, it can be used like this: app.use(jsonBodyParserType({ type: 'application/vnd.custom-type' }));
 *
 */
export function jsonBodyParserType(options: BodyParserOptionsInterface): express.RequestHandler {
    return bodyParserMiddleware(JSON.parse, options);
}