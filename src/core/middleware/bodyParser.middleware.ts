import express from "express";
import {Exception, HttpStatusCodesConstant} from "../../index";
import {ParseFunctionType} from "../types/parseFunction.type";
import {BodyParserOptionsInterface} from "../interfaces/bodyParserOptions.interface";
import {LogMessageUtils} from "../utils/logMessage.utils";


/**
 *
 * @param parseFunction
 * @param options
 *
 * This is a middleware that allows parsing data
 *
 */
export function bodyParserMiddleware(parseFunction: ParseFunctionType, options: BodyParserOptionsInterface) {
    return function (req: express.Request, res: express.Response, next:  express.NextFunction): void {
        req.headers['content-type']?.includes(options.type)
            ? ((): void => {
                let body: Uint8Array[] = [];
                req.on("data", (chunk: any): void => {
                    body.push(chunk);
                });

                req.on("end", (): void => {
                    const rawBody = Buffer.concat(body).toString();
                    try {
                        req.body = parseFunction(rawBody);
                    } catch (error) {
                        req.body = null;
                    }
                    next();
                });

                req.on("error", (err: any): void => {
                    LogMessageUtils.error(
                        "Error receiving data",
                        "Request error",
                        "Type error",
                        Exception.invalidRequest,
                        "Error message",
                        `${res.send(err.message)}`,
                        HttpStatusCodesConstant.BAD_REQUEST
                    );
                });
            })()
            : ((): void => {
                next();
            })();
    }
}