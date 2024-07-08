import { dotenv } from "../..";


/**
 * ServerEnvConfig is an abstract class that allows with its methods getting
 * the values of the variables defined in the .env file
 */
export abstract class ServerEnvConfig {
    protected constructor() {
        const nodeNameEnv = this.createPathEnv(this.nodeEnv);
        dotenv.config({
            path: nodeNameEnv,
        })
    }

    public getEnvironment (k: string): string | undefined {
        return process.env[k]
    }

    public getNumberEnv (k: string): number {
        return Number(this.getEnvironment(k));
    }

    public get nodeEnv (): string {
        return this.getEnvironment('NODE_ENV')?.trim() || "";
    }

    public createPathEnv (path: string): string {
        const arrEnv: Array<string> = ["env"];
        if (path.length > 0 ) {
            const stringToArray = path.split(".");
            arrEnv.unshift(...stringToArray);
        }
        return "." + arrEnv.join(".")
    }
}

