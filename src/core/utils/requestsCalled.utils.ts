import {IncomingMessage, ServerResponse} from "node:http";

export function requestsCalledUtils(req: IncomingMessage,res: ServerResponse) {
    const request: IncomingMessage = res.req;
}