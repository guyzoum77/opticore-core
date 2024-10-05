import colors from "ansi-colors";
import {IncomingMessage, ServerResponse} from "node:http";
import {WrappingBodyResponseInterface} from "../interfaces/wrappingBodyResponse.interface";

export function requestCallsEvent(req: IncomingMessage, res: ServerResponse, host: string, port: number, loadingTime: any) {
    const currentDatePath: string = `Request called`;
    // @ts-ignore
    if(req.originalUrl === "undefined") {
        console.log(`[ ${colors.red(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgRed(`${colors.white(` Not found `)}`)} [ Host ] http://${host}:${port} - [ Route ] The route do not exist. - [ Status ] ${colors.red(`${colors.white(` 404 `)}`)}`)
    } else {
        /**
         * Capture du corps de la reponse.
         */
        let responseBody: string = "";

        /**
         * Encapsulation de res.write pour capturer les données écrites dans la réponse.
         */
        const originalWrite = res.write;
        res.write = function (...args: any[]) {
            /**
             * Capturez le bloc de données en cours d'écriture
             */
            if (typeof args[0] === 'string' || Buffer.isBuffer(args[0])) {
                responseBody += args[0];
            }

            /**
             * Appelez la méthode d'écriture d'origine.
             */
            return originalWrite.apply(res, arguments);  // Call the original write method
        };

        /**
         * Encapsulation de res.end pour capturer le corps final.
         */
        const originalEnd = res.end;
        res.end = function (...args: any[]) {
            /**
             * Capture le bloc final, le cas échéant
             */
            if (args[0]) {
                responseBody += args[0];
            }

            /**
             * Enregistre le corps complet de la réponse
             */
            console.log("Response body:", responseBody);

            /**
             * Appelle la méthode end d'origine
             */
            return originalEnd.apply(res, arguments);
        };

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