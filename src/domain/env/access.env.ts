/**
 * Get env variables
 */
import dotenv from "dotenv";
import {EnvVariablesInterface} from "../../core/interfaces/envVariables.interface";


export const getEnvVariable: EnvVariablesInterface = {
    appHost:                     String(dotenv.config()?.parsed?.APP_HOST),
    appPort:                     String(dotenv.config()?.parsed?.APP_PORT),
    prodEnv:                     String(dotenv.config()?.parsed?.ENV_PROD),
    devEnv:                      String(dotenv.config()?.parsed?.ENV_DEV),
    dataBaseHost:                String(dotenv.config()?.parsed?.DATA_BASE_HOST),
    dataBasePort:                String(dotenv.config()?.parsed?.DATA_BASE_PORT),
    dataBaseUser:                String(dotenv.config()?.parsed?.DATA_BASE_USER),
    dataBasePassword:            String(dotenv.config()?.parsed?.DATA_BASE_PASSWORD),
    dataBaseName:                String(dotenv.config()?.parsed?.DATA_BASE_NAME),
    apiVersion:                  String(dotenv.config()?.parsed?.API_VERSION),
    usernameField:               String(dotenv.config()?.parsed?.USERNAME_FIELD),
    passwordField:               String(dotenv.config()?.parsed?.PASSWORD_FIELD),
    argumentsDatabaseConnection: String(dotenv.config()?.parsed?.ARGUMENTS_DATABASE_CONNECTION),
    logEnv:                      String(dotenv.config()?.parsed?.LOG_ENVIRONMENT)
}