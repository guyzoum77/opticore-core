import {express, requestsStoredUtils, UtilityUtils} from "../../index";
import {Server} from "node:net";
import colors from "ansi-colors";

export class ServerListenUtils {
    private utility: UtilityUtils = new UtilityUtils();
    public webServerOnStartEvent(app: express.Application, host: string, port: number,
                                  appModules: NodeJS.Module[] | undefined, loadingTime: any) {
        const webServer: Server = app.listen(port, host, () => {
            this.utility.infoServer(
                this.utility.getVersions().nodeVersion,
                this.utility.getProjectInfo().startingTime,
                host,
                port,
                this.utility.getUsageMemory().rss,
                this.utility.getUsageMemory().heapUsed,
                this.utility.getUsageMemory().user,
                this.utility.getUsageMemory().system
            );
            this.utility.loadMainAppEntry(appModules, loadingTime);
            this.utility.loadRouterModule(appModules, loadingTime);
            console.log('');
            this.utility.loadFeaturesModulesCreated(appModules, loadingTime);
            console.log('');
        });
        return webServer;
    }

    public webServerOnListeningEvent(webServer: Server, app: express.Application, host: string, port: number,
                                     appModules: NodeJS.Module[] | undefined, loadingTime: any) {
        webServer.on(
            "listening",
            () => {
                const currentDatePath = `[${colors.green(` Route stored `)}] ${loadingTime}`;
                requestsStoredUtils(app, currentDatePath, host, port);
            }
        );
    }
}