import "reflect-metadata";
import {LogMessageUtils} from "./utils/logMessage.utils.js";
import {HttpStatusCodesConstant as status} from "../domain/constants/httpStatusCodes.constant";
import {modulesLoadedUtils as loadedModules} from "./utils/modulesLoaded.utils";


export async function loadKernel(kernel: any[]) {
    try {
        const routesApp: (Awaited<any>)[] = await Promise.all(kernel.map((loader: any) => loader()));
        const serverSide = routesApp[1].app;
        serverSide();

        const routers = routesApp[0].registerRoutes;
        routers().map((router: any) => { return router; });

        const db = routesApp[2].dbConnection;
        db();

        const kernelExportModule = await require.main?.children[1].exports.Kernel();
        loadedModules(await kernelExportModule[0](), await kernelExportModule[2]());
        console.log("");
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
