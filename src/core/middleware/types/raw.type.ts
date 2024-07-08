import {bodyParserMiddleware} from "../bodyParser.middleware";
import {BodyParserOptionsInterface} from "../../interfaces/bodyParserOptions.interface";

/**
 *
 * @param options
 *
 * Use by this: rawBodyParserType({ type: 'application/vnd.custom-type' })
 *
 * in express, it can be used like this: app.use(rawBodyParserType({ type: 'application/vnd.custom-type' }));
 *
 */
export function rawBodyParserType(options: BodyParserOptionsInterface): void {
    bodyParserMiddleware((rawBody: string) => Buffer.from(rawBody, 'binary'), options);
}