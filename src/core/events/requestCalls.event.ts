import colors from "ansi-colors";
import {IncomingMessage, ServerResponse} from "node:http";
import {WrappingBodyResponseInterface} from "../interfaces/wrappingBodyResponse.interface";
import {originalWriteEncodingType} from "../types/originalWriteEncoding.type";
import {ResponseBodyEndFromResponseEventInterface} from "../interfaces/responseBodyEndFromResponseEvent.interface";
import {ResponseBodyWriteFromResponseEventInterface} from "../interfaces/responseBodyWriteFromResponseEvent.interface";

export function requestCallsEvent(req: IncomingMessage, res: ServerResponse, host: string, port: number, loadingTime: any) {
    const currentDatePath: string = `Request called`;
    // @ts-ignore
    if(req.originalUrl === "undefined") {
        console.log(`[ ${colors.red(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgRed(`${colors.white(` Not found `)}`)} [ Host ] http://${host}:${port} - [ Route ] The route do not exist. - [ Status ] ${colors.red(`${colors.white(` 404 `)}`)}`)
    } else {
        /**
         * Capture du corps de la réponse
         */
        let responseBody: string = "";

        /**
         * Encapsulation de res.write pour capturer les données écrites dans la réponse
         */
        const originalWrite: OmitThisParameter<ResponseBodyWriteFromResponseEventInterface> = res.write.bind(res);
        const originalEnd: OmitThisParameter<ResponseBodyEndFromResponseEventInterface> = res.end.bind(res);

        res.write = function (chunk: any, encoding?: BufferEncoding, callback?: (error?: Error | null) => void): boolean {
            /**
             * Capturez le corps de la réponse si le bloc est une chaîne ou un tampon
             */
            if (typeof chunk === "string" || Buffer.isBuffer(chunk)) {
                /**
                 * Capturer le bloc de données en cours d'écriture
                 */
                responseBody += chunk;
            }

            /**
             * Appeler la méthode d'écriture d'origine
             */
            return originalWrite(chunk, <originalWriteEncodingType>encoding, callback);
        } as typeof res.write;

        /**
         * Envelopper res.end pour capturer le corps final
         */
        res.end = function (chunk?: any, callback?: () => void): void {
            if (chunk) {
                if (typeof chunk === "string" || Buffer.isBuffer(chunk)) {
                    /**
                     * Capturez le dernier morceau, le cas échéant
                     */
                    responseBody += chunk;
                }
            }

            /**
             * Enregistrez le corps de la réponse complète
             */
            console.log("Response body:", responseBody);

            /**
             * Appelez la méthode de fin d'origine avec les arguments corrects
             */
            if (callback) {
                if (chunk) {
                    /**
                     * Si un fragment est fourni et que le rappel existe
                     */
                    originalEnd(chunk, callback);
                } else {
                    /**
                     * S'il n'y a pas de bloc, appelez simplement avec rappel
                     */
                    originalEnd(callback);
                }
            } else {
                /**
                 * Appelez simplement originalEnd avec chunk (ou undefined)
                 */
                originalEnd(chunk);
            }
        } as typeof res.end;

        switch (res.statusCode) {
            case 200:
                switch (req.method) {
                    case 'POST': // @ts-ignore
                        console.log(`[ ${colors.cyan(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgGreen(`${colors.white(` Success `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.bgCyan(`${colors.white(` 200 `)}`)}`)
                        break;
                    case 'GET':
                    case 'PUT': // @ts-ignore
                        console.log(`[ ${colors.cyan(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgGreen(`${colors.white(` Success `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.bgCyan(`${colors.white(` 200 `)}`)}`);
                        break;
                    case 'DELETE': // @ts-ignore
                        console.log(`[ ${colors.cyan(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgGreen(`${colors.white(` Success `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.bgCyan(`${colors.white(` 200 `)}`)}`);
                        break;
                }
                break;
            case 404:
                switch (req.method) {
                    case 'POST': // @ts-ignore
                        console.log(`[ ${colors.red(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgRed(`${colors.white(` Not found `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.red(`${colors.white(` 404 `)}`)}`);
                        break;
                    case 'GET': // @ts-ignore
                        console.log(`[ ${colors.red(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgRed(`${colors.white(` Not found `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.red(`${colors.bold(` 404 `)}`)}`);
                        break;
                    case 'PUT': // @ts-ignore
                        console.log(`[ ${colors.red(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgRed(`${colors.white(` Not found `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.red(`${colors.bold(` 404 `)}`)}`);
                        break;
                    case 'DELETE': // @ts-ignore
                        console.log(`[ ${colors.red(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgRed(`${colors.white(` Not found `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.red(`${colors.bold(` 404 `)}`)}`);
                        break;
                }
                break;
            case 401:
                switch (req.method) {
                    case 'POST': // @ts-ignore
                        console.log(`[ ${colors.yellowBright(`${currentDatePath}`)} ] ${loadingTime} |  ${colors.bgYellowBright(`${colors.white(` Unauthorized `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.bgYellow(`${colors.bold(` 401 `)}`)}`);
                        break;
                    case 'GET': // @ts-ignore
                        console.log(`[ ${colors.yellowBright(`${currentDatePath}`)} ] ${loadingTime} |  ${colors.bgYellowBright(`${colors.white(` Unauthorized `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.bgYellow(`${colors.bold(` 401 `)}`)}`);
                        break;
                    case 'PUT': // @ts-ignore
                        console.log(`[ ${colors.yellowBright(`${currentDatePath}`)} ] ${loadingTime} |  ${colors.bgYellowBright(`${colors.white(` Unauthorized `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.bgYellow(`${colors.bold(` 401 `)}`)}`);
                        break;
                    case 'DELETE': // @ts-ignore
                        console.log(`[ ${colors.yellowBright(`${currentDatePath}`)} ] ${loadingTime} |  ${colors.bgYellowBright(`${colors.white(` Unauthorized `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.bgYellow(`${colors.bold(` 401 `)}`)}`);
                        break;
                }
                break;
            case 500:
                switch (req.method) {
                    case 'POST': // @ts-ignore
                        console.log(`[ ${colors.red(`${currentDatePath}`)} ]  ${loadingTime} | ${colors.bgRed(`${colors.white(` Server error `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.red(`${colors.bold(` 500 `)}`)}`);
                        break;
                    case 'GET': // @ts-ignore
                        console.log(`[ ${colors.red(`${currentDatePath}`)} ]  ${loadingTime} | ${colors.bgRed(`${colors.white(` Server error `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.red(`${colors.bold(` 500 `)}`)}`);
                        break;
                    case 'PUT': // @ts-ignore
                        console.log(`[ ${colors.red(`${currentDatePath}`)} ]  ${loadingTime} | ${colors.bgRed(`${colors.white(` Server error `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.red(`${colors.bold(` 500 `)}`)}`);
                        break;
                    case 'DELETE': // @ts-ignore
                        console.log(`[ ${colors.red(`${currentDatePath}`)} ]  ${loadingTime} | ${colors.bgRed(`${colors.white(` Server error `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.red(`${colors.bold(` 500 `)}`)}`);
                        break;
                }
                break;
            default:
                console.log("dump req from request calls event :", req); // @ts-ignore
                console.log(`[ ${colors.blueBright(`${currentDatePath}`)} ] ${loadingTime} | ${colors.blueBright(` ${res.statusMessage} `)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.blueBright(` ${res.req.socket._httpMessage.statusCode} `)}`);
                break;
        }
    }
}