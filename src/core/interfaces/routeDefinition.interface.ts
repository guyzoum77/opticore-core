import express from "express";

export interface IRouteDefinition {
    path: string;
    handler: express.Router;
}