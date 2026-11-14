/**
 * Get env variables
 *
 * The `.env` file is read once (quietly: dotenv >= 17 prints a banner otherwise).
 */
import dotenv from "dotenv";
import {EnvVariablesInterface} from "../../core/interfaces/envVariables.interface";

const parsedEnv: Record<string, string> | undefined = dotenv.config({ quiet: true })?.parsed;

export const getEnvVariable: EnvVariablesInterface = {
    appHost:                     String(parsedEnv?.APP_HOST),
    appPort:                     String(parsedEnv?.APP_PORT),
    prodEnv:                     String(parsedEnv?.ENV_PROD),
    devEnv:                      String(parsedEnv?.ENV_DEV),
    dataBaseHost:                String(parsedEnv?.DATA_BASE_HOST),
    dataBasePort:                String(parsedEnv?.DATA_BASE_PORT),
    dataBaseUser:                String(parsedEnv?.DATA_BASE_USER),
    dataBasePassword:            String(parsedEnv?.DATA_BASE_PASSWORD),
    dataBaseName:                String(parsedEnv?.DATA_BASE_NAME),
    apiVersion:                  String(parsedEnv?.API_VERSION),
    usernameField:               String(parsedEnv?.USERNAME_FIELD),
    passwordField:               String(parsedEnv?.PASSWORD_FIELD),
    argumentsDatabaseConnection: String(parsedEnv?.ARGUMENTS_DATABASE_CONNECTION),
    logEnv:                      String(parsedEnv?.LOG_ENVIRONMENT)
}
