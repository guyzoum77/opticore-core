import {getEnvVariable, CoreApplication, env, express, KernelModuleInterface, currentDate} from "../../index";
import {Server} from "node:net";
import {KernelModuleType} from "../types/kernelModule.type";

export class RunBootstrap {
    private static env: env<any> = new env(getEnvVariable);
    private static app: express.Application = express();
    private static entryApp: CoreApplication = new CoreApplication();

    static run<T extends (app: express.Application) => [express.Router[], () => void]>(Kernel: T): void {
        const [routers, dbConn] = Kernel(this.app);
        const server: Server = this.entryApp.onStartServer(
            this.env.get("appHost"),
            Number(this.env.get("appPort")),
            routers
        );
        this.entryApp.onListeningOnServerEvent(
            server,
            Kernel(this.app) as KernelModuleType
        );
        this.entryApp.onRequestOnServerEvent(
            server,
            this.env.get("appHost"),
            Number(this.env.get("appPort")),
            currentDate
        );
    }
}