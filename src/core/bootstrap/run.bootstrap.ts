import {express, currentDate} from "../../index";
import {Server} from "node:net";
import {KernelModuleType} from "../types/kernelModule.type";
import {CoreConfig} from "../config/core.config";


export const runBootstrap = <K extends KernelModuleType>(kernel: (app: express.Application) => K): void => {
    const [routers, dbConn] = kernel(CoreConfig.app);
    const port: number = Number(CoreConfig.env.get("appPort"));

    const server: Server = CoreConfig.entryApp.onStartServer(CoreConfig.env.get("appHost"), port, routers);

    CoreConfig.entryApp.onListeningOnServerEvent(server, kernel(CoreConfig.app));
    CoreConfig.entryApp.onRequestOnServerEvent(server, CoreConfig.env.get("appHost"), port, currentDate);
}