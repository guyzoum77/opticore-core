import express from "express";

export class RoutersAppCore {
    static route(items: { path: string; handler: express.Router }[]) {
        return items;
    }
}