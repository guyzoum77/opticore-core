import "reflect-metadata";
import express from "express";
import {LogMessageUtils} from "./utils/logMessage.utils.js";
import {HttpStatusCodesConstant as status} from "../domain/constants/httpStatusCodes.constant";
import {modulesLoadedUtils as loadedModules} from "./utils/modulesLoaded.utils";


export async function loadKernel(Kernel: any) {
    try {
        const routesApp: Awaited<any>[] = await Promise.all(Kernel.map(async(loader: any): Promise<()=> express.Router[]> => {
            const module = await loader();
            return module.routers;
        }));
        let routes;
        routesApp.map((element: any) => { element !== undefined ? routes = element : undefined; });
        LogMessageUtils.success("Kernel", "load kernel", "Modules app have been successfully loaded");
        const kernelExportModule = await require.main?.children[1].exports.Kernel;
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
