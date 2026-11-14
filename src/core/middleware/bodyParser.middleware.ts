import express from "express";
import {Exception, HttpStatusCodesConstant} from "../../index";
import {ParseFunctionType} from "../types/parseFunction.type";
import {BodyParserOptionsInterface} from "../interfaces/bodyParserOptions.interface";
import {LogMessageUtils} from "../utils/logMessage.utils";

/**
 * Default maximum body size accepted by the parser (100 KiB, same default as express.json()).
 */
export const DEFAULT_BODY_LIMIT: number = 100 * 1024;

/**
 *
 * @param parseFunction
 * @param options
 *
 * This is a middleware that allows parsing data.
 * The body is buffered up to `options.limit` bytes (default `DEFAULT_BODY_LIMIT`); larger
 * bodies are answered with 413 and are not buffered. Stream errors are answered with a
 * generic 400 (the internal error message is only logged).
 */
export function bodyParserMiddleware(parseFunction: ParseFunctionType, options: BodyParserOptionsInterface) {
    const limit: number = Number.isSafeInteger(options?.limit) && (options.limit as number) > 0
        ? options.limit as number
        : DEFAULT_BODY_LIMIT;

    return function (req: express.Request, res: express.Response, next:  express.NextFunction): void {
        if (!req.headers['content-type']?.includes(options.type)) {
            next();
            return;
        }

        const declaredLength: number = Number(req.headers['content-length']);
        if (Number.isFinite(declaredLength) && declaredLength > limit) {
            res.status(HttpStatusCodesConstant.PAYLOAD_TOO_LARGE).set("Connection", "close").send("Payload Too Large");
            return;
        }

        const body: Buffer[] = [];
        let received: number = 0;
        let finished: boolean = false;

        req.on("data", (chunk: Buffer | string): void => {
            if (finished) return;
            const buffer: Buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
            received += buffer.length;
            if (received > limit) {
                finished = true;
                body.length = 0;
                res.status(HttpStatusCodesConstant.PAYLOAD_TOO_LARGE).set("Connection", "close").send("Payload Too Large");
                return;
            }
            body.push(buffer);
        });

        req.on("end", (): void => {
            if (finished) return;
            finished = true;
            const rawBody: string = Buffer.concat(body).toString();
            try {
                req.body = parseFunction(rawBody);
            } catch (error) {
                req.body = null;
            }
            next();
        });

        req.on("error", (err: any): void => {
            if (finished) return;
            finished = true;
            LogMessageUtils.error(
                "Error receiving data",
                "Type error",
                Exception.invalidRequest,
                err?.message,
                HttpStatusCodesConstant.BAD_REQUEST
            );
            if (!res.headersSent) {
                res.status(HttpStatusCodesConstant.BAD_REQUEST).send("Bad Request");
            }
        });
    }
}
