import {dotenv} from "../../presentation/components/sharedModules.component";

/**
 * Get env variables user, password and database.
 */
export class AccessEnv {
    static dataBasePort(): string {
        return String(dotenv.config()?.parsed?.DATA_BASE_PORT);
    }

    static user(): string {
        return String(dotenv.config()?.parsed?.MYSQL_USER);
    }
    
    static password(): string {
        return String(dotenv.config()?.parsed?.MYSQL_PASSWORD);
    }

    static dataBaseName(): string {
        return String(dotenv.config()?.parsed?.MYSQL_DATABASE);
    }

    static apiVersion(): string {
        return String(dotenv.config()?.parsed?.API_VERSION);
    }

    static usernameField(): string {
        return String(dotenv.config()?.parsed?.USERNAME_FIELD);
    }
    static passwordField(): string {
        return String(dotenv.config()?.parsed?.PASSWORD_FIELD);
    }
}