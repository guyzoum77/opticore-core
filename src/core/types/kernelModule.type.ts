import {IRouteDefinition} from "@/core/interfaces/routeDefinition.interface";

export type KernelModuleType = [{ featureRoute: IRouteDefinition[] }[], () => void];