import {IRouteDefinition} from "@/core/interfaces/routeDefinition.interface";

export class oPTRegisterRouters {

    /**
     * Dynamically register multiple routers.
     * @param oPTFeaturesRoutes - Array of route definitions
     */
    register(oPTFeaturesRoutes: { featureRoute: IRouteDefinition[] }[]) {
        return oPTFeaturesRoutes;
    }
}