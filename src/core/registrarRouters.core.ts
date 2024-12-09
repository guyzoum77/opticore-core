import express from "express";

export class RegistrarRoutersCore {
    static route(items: { path: string; router: express.Router }[]) {
        return items;
    }
}