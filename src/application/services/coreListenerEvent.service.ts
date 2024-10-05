import express from "express";
import {modulesLoadedUtils as loadedModules} from "../../core/utils/modulesLoaded.utils";
import StackTraceError from "../../core/handlers/errors/base/stackTraceError";
import {Exception as msg, HttpStatusCodesConstant as status, LogMessageUtils as log} from "../../index";
import {KernelModuleInterface} from "../../core/interfaces/kernelModule.interface";

export function coreListenerEventService(kernelModule: KernelModuleInterface[]) {
    let router: express.Router[] = [];
    let dbCon: (() => void) | undefined;

    kernelModule.forEach((module: KernelModuleInterface): void => {
        if (Array.isArray(module)) {
            router = module as express.Router[];
        } else if (typeof module === "function") {
            dbCon = module as () => void;
        }
    });

    if (router && dbCon) {
        loadedModules(router, dbCon);
        ((): void => { dbCon(); })();
    } else {
        const stackTrace: StackTraceError = this.traceError(
            msg.loadedModulesError,
            msg.loadedModules,
            status.NOT_ACCEPTABLE
        );
        log.error(
            msg.loadedModules,
            "loading error",
            stackTrace.stack,
            msg.loadedModulesError,
            status.SERVICE_UNAVAILABLE
        );
        throw new Error(stackTrace.message);
    }
}