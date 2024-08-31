import "reflect-metadata";
import {LogMessageUtils} from "./utils/logMessage.utils.js";
import {HttpStatusCodesConstant as status} from "../domain/constants/httpStatusCodes.constant";
import {modulesLoadedUtils as loadedModules} from "./utils/modulesLoaded.utils";


export async function loadKernel(kernel: any[]) {
    try {
        const routesApp: (Awaited<any>)[] = await Promise.all(kernel.map((loader: any) => loader())); //@ts-ignore
        const serverSide = routesApp[1].app;
        serverSide(); //@ts-ignore
        const routers = routesApp[0].registerRoutes;
        routers().map((router: any) => { return router; }); //@ts-ignore
        const db = routesApp[2].dbConnection;
        db();

        const kernelExportModule = await require.main?.children[1].exports.Kernel();
        loadedModules(await kernelExportModule[0](), await kernelExportModule[1](), await kernelExportModule[2]());

    } catch (error: any) {
        LogMessageUtils.error(
            "Kernel",
            "error loading",
            "Modules",
            "error occurring",
            "error",
            error.message,
            status.INTERNAL_SERVER_ERROR
        );
        process.exit(1);
    }
}
