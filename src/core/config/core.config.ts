import {env, CoreApplication, express, getEnvVariable} from "../../index";

export class CoreConfig {
    public static env: env<any> = new env(getEnvVariable);
    public static app: express.Application = express();
    public static entryApp: CoreApplication = new CoreApplication();
}