import {bodyParserMiddleware} from "../middleware/bodyParser.middleware";
import {parseUrlencodedUtils} from "../utils/parseUrlencoded.utils";
import {BodyParserOptionsInterface} from "../interfaces/bodyParserOptions.interface";

/**
 *
 * @param options
 *
 * Use by this: urlencodedBodyParserType({ type: 'application/x-www-form-urlencoded' })
 *
 * in express, it can be used like this: app.use(urlencodedBodyParserType({ type: 'application/x-www-form-urlencoded' }));
 *
 */
export function urlencodedBodyParserType(options: BodyParserOptionsInterface): void {
    bodyParserMiddleware(parseUrlencodedUtils, options);
}