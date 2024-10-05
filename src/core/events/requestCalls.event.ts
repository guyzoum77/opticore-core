import colors from "ansi-colors";
import {IncomingMessage, ServerResponse} from "node:http";

export function requestCallsEvent(req: IncomingMessage, res: ServerResponse, host: string, port: number, loadingTime: any) {
    const currentDatePath: string = `Request called`;
    // @ts-ignore
    console.log("req.originalUrl from requestCallsEvent is :", req.originalUrl);

    // if(req.originalUrl === "undefined") {
    //     console.log(`[ ${colors.red(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgRed(`${colors.white(` Not found `)}`)} [ Host ] http://${host}:${port} - [ Route ] The route do not exist. - [ Status ] ${colors.red(`${colors.white(` 404 `)}`)}`)
    // } else {
    //
    // }
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