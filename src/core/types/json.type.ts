import {bodyParserMiddleware} from "../middleware/bodyParser.middleware";
import {BodyParserOptionsInterface} from "../interfaces/bodyParserOptions.interface";

/**
 *
 * @param options
 *
 * Use by this: jsonBodyParserType({ type: 'application/vnd.custom-type' })
 *
 * in express, it can be used like this: app.use(jsonBodyParserType({ type: 'application/vnd.custom-type' }));
 *
 */
export function jsonBodyParserType(options: BodyParserOptionsInterface): void {
    bodyParserMiddleware(JSON.parse, options);
}