import { dotenv } from "../..";

/**
 * Get env variables user, password and database.
 */
export class AccessEnv {
    static appHost(): string {
        return String(dotenv.config()?.parsed?.APP_HOST);
    }

    static appPort(): string {
        return String(dotenv.config()?.parsed?.APP_PORT);
    }

    static prodEnv(): string {
        return String(dotenv.config()?.parsed?.ENV_PROD);
    }

    static devEnv(): string {
        return String(dotenv.config()?.parsed?.ENV_DEV);
    }

    static dataBaseHost(): string {
        return String(dotenv.config()?.parsed?.DATA_BASE_HOST);
    }

    static dataBasePort(): string {
        return String(dotenv.config()?.parsed?.DATA_BASE_PORT);
    }

    static user(): string {
        return String(dotenv.config()?.parsed?.DATA_BASE_USER);
    }
    
    static password(): string {
        return String(dotenv.config()?.parsed?.DATA_BASE_PASSWORD);
    }

    static dataBaseName(): string {
        return String(dotenv.config()?.parsed?.DATA_BASE_NAME);
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