import {DbConnexionConfig} from "../config/dbConnexion.config";

export const postgresCheckerDatabase = (optionalArgumentConnection: string | any) => {
    const DbConnexion: DbConnexionConfig = new DbConnexionConfig();
    return DbConnexion.databasePostgresDBConnectionChecker(optionalArgumentConnection);
}