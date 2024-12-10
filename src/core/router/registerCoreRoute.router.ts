import {IRouteDefinition} from "@/core/interfaces/routeDefinition.interface";

export class RegisterCoreRouteRouter {
    /**
     * Dynamically register multiple routers.
     * @param allFeatureRoutes - Array of route definitions
     */
    register(allFeatureRoutes: { featureRoute: IRouteDefinition[] }[]) {
        return allFeatureRoutes;
    }
}