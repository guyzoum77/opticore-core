import {IncomingMessage, ServerResponse} from "node:http";

export interface ResponseBodyEndFromResponseEventInterface {
    (cb?: () => void): ServerResponse<IncomingMessage>, (chunk: any, cb?: () => void): ServerResponse<IncomingMessage>;
    (chunk: any, encoding: BufferEncoding, cb?: () => void): ServerResponse<IncomingMessage>;
}