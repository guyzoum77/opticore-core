import { dotenv } from "../..";


/**
 * EnvConfig is an abstract class that allows with its methods getting
 * the values of the variables defined in the .env file
 */
export abstract class EnvConfig {
    protected constructor() {
        import.meta.url
        const nodeNameEnv: string = this.createPathEnv(this.nodeEnv);
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
        const arrEnv: string[] = ["env"];
        if (path.length > 0 ) {
            const stringToArray: string[] = path.split(".");
            arrEnv.unshift(...stringToArray);
        }
        return "." + arrEnv.join(".")
    }
}

