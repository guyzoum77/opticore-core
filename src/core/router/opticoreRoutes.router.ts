import {oPTMultipleRouter} from "@/core/router/oPTMultipleRoute.router";
import {ICustomContext} from "@/core/interfaces/customContext.interface";
import {IMultipleRouterConfig} from "@/core/interfaces/multipleRouterConfig.interface";
import {TAuthenticatorFunction} from "@/core/types/authenticatorFunction.type";
import {oPTSingleRouter} from "@/core/router/oPTSingleRoute.router";
import {TRouteConfigHttpMethod} from "@/core/types/routeConfigHttpMethod.type";
import {TRouteHandler} from "@/core/types/routeHandler.type";
import {IAuthPassportOptions} from "@/core/interfaces/authPassportOptions";

export class OpticoreRouters {
    static route(method: TRouteConfigHttpMethod, 
                 path: string,
                 handler: TRouteHandler,
                 middleware: boolean = false,
                 strategy: string,
                 options: IAuthPassportOptions) {
        const OPTRouter: oPTSingleRouter = new oPTSingleRouter();
        OPTRouter.route(method, path, handler, middleware);

        return OPTRouter.getRoute(strategy, options);
    }

    static routes(controller: any, routes: IMultipleRouterConfig<ICustomContext>[], authenticator?: TAuthenticatorFunction<ICustomContext>) {
        const OPTRouter: oPTMultipleRouter<ICustomContext> = new oPTMultipleRouter(controller, routes, authenticator);

        return OPTRouter.getRoute();
    }
}