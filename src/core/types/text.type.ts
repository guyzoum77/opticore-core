import {bodyParserMiddleware} from "../middleware/bodyParser.middleware";
import {BodyParserOptionsInterface} from "../interfaces/bodyParserOptions.interface";

/**
 *
 * @param options
 *
 * Use by this: textBodyParserType({ type: 'text/html' })
 *
 * in express, it can be used like this: app.use(textBodyParserType({ type: 'text/html' }));
 *
 */
export function textBodyParserType(options: BodyParserOptionsInterface): void {
    bodyParserMiddleware((rawBody: string) => rawBody, options);
}