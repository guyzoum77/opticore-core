import {DbConnexionConfig} from "../config/dbConnexion.config";

export const mongoCheckerDatabase = (optionalArgumentConnection: string | any) => {
    const DbConnexion: DbConnexionConfig = new DbConnexionConfig();
    return DbConnexion.databaseMongoDBConnectionChecker(optionalArgumentConnection);
}