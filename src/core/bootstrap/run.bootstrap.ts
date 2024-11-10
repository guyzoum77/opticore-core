import {express, currentDate} from "../../index";
import {Server} from "node:net";
import {KernelModuleType} from "../types/kernelModule.type";
import {CoreConfig} from "../config/core.config";


export const runBootstrap = (kernel: (app: express.Application) => KernelModuleType): void => {
    const [routers, dbConn] = kernel(CoreConfig.app);
    const server: Server = CoreConfig.entryApp.onStartServer(
        CoreConfig.env.get("appHost"),
        Number(CoreConfig.env.get("appPort")),
        routers
    );

    CoreConfig.entryApp.onListeningOnServerEvent(server, kernel(CoreConfig.app));
    CoreConfig.entryApp.onRequestOnServerEvent(
        server,
        CoreConfig.env.get("appHost"),
        Number(CoreConfig.env.get("appPort")),
        currentDate
    );
}