import express from "express";

export interface KernelModuleInterface {
    registerAppRoutes: express.Router[];
    databaseConn: (() => void);
}