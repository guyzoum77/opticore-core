import express from "express";

export class RegistrarRoutersCore {
    static routes(items: { path: string; router: express.Router }[]) {
        return items;
    }
}