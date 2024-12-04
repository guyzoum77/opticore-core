import express from "express";
import {modulesLoadedUtils as loadedModules} from "../../core/utils/modulesLoaded.utils";
import StackTraceError from "../../core/handlers/errors/base/stackTraceError";
import {Exception as msg, HttpStatusCodesConstant as status, LogMessageUtils as log} from "../../index";
import {KernelModuleInterface} from "../../core/interfaces/kernelModule.interface";
import {KernelModuleType} from "../../core/types/kernelModule.type";

export function coreListenerEventLoaderModuleService<T extends KernelModuleType>(kernelModule: T) {
    let router: express.Router[] = [];
    let dbCon: (() => void) | undefined;

    kernelModule.forEach((module): void => {
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
        const stackTrace: StackTraceError = new StackTraceError(
            msg.loadedModulesError,
            msg.loadedModules,
            status.NOT_ACCEPTABLE,
            true
        );
        throw new Error(stackTrace.message);
    }
}