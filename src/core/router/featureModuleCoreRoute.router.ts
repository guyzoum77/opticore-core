import {Router} from "express";

export class FeatureModuleCoreRouteRouter {
    private readonly router = Router();

    get routerModuleApp() {
        return this.router;
    }
}