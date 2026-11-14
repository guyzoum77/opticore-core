import express from "express";
import {bodyParserMiddleware} from "../middleware/bodyParser.middleware";
import {parseUrlencodedUtils} from "../utils/parseUrlencoded.utils";
import {BodyParserOptionsInterface} from "../interfaces/bodyParserOptions.interface";

/**
 *
 * @param options
 *
 * Use by this: urlencodedBodyParserType({ type: 'application/x-www-form-urlencoded' })
 *
 * It returns the middleware (older versions returned nothing, which made it unusable).
 * Bodies larger than `options.limit` bytes (default 100 KiB) are rejected with 413.
 *
 * in express, it can be used like this: app.use(urlencodedBodyParserType({ type: 'application/x-www-form-urlencoded' }));
 *
 */
export function urlencodedBodyParserType(options: BodyParserOptionsInterface): express.RequestHandler {
    return bodyParserMiddleware(parseUrlencodedUtils, options);
}