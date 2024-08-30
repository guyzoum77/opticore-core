import {DbConnexionConfig} from "../config/dbConnexion.config";

export const mySqlCheckerDatabase = (optionalArgumentConnection: string | any) => {
    const DbConnexion: DbConnexionConfig = new DbConnexionConfig();
    return DbConnexion.databaseMySQLConnexionChecker(optionalArgumentConnection);
}