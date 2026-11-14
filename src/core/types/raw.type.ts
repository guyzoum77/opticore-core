import express from "express";
import {bodyParserMiddleware} from "../middleware/bodyParser.middleware";
import {BodyParserOptionsInterface} from "../interfaces/bodyParserOptions.interface";

/**
 *
 * @param options
 *
 * Use by this: rawBodyParserType({ type: 'application/vnd.custom-type' })
 *
 * It returns the middleware (older versions returned nothing, which made it unusable).
 * Bodies larger than `options.limit` bytes (default 100 KiB) are rejected with 413.
 *
 * in express, it can be used like this: app.use(rawBodyParserType({ type: 'application/vnd.custom-type' }));
 *
 */
export function rawBodyParserType(options: BodyParserOptionsInterface): express.RequestHandler {
    return bodyParserMiddleware((rawBody: string) => Buffer.from(rawBody, 'binary'), options);
}