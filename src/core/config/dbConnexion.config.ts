import {
    ExceptionHandlerError, LoggerFormat, mySQL, ServerEnvConfig, AccessEnv
} from "../../presentation/components/sharedModules.component";
import {HttpStatusCodesConstant} from "../../domain/constants/httpStatusCodes.constant";
import {CheckerDatabaseConnectionService} from "../../application/services/checkerDatabaseConnection.service";


/**
 * DbConnexionConfig is a class extending on the ServerEnvConfig class so that by inheritance,
 * certain methods make it possible to retrieve the variables values defined in
 * the .env environment file to establish the connection with the database service.
 */
export default class DbConnexionConfig extends ServerEnvConfig {
    private dbPort: string   = AccessEnv.dataBasePort();
    private user: string     = AccessEnv.user();
    private password: string = AccessEnv.password();
    private dbName: string   = AccessEnv.dataBaseName();

    public loggerFormat: LoggerFormat;

    constructor(logger: LoggerFormat) {
        super();
        this.loggerFormat = logger;
        this.databaseConnexionConfig();
    }

    public databaseConnexionConfig() {
        const url: string = `mysql://${this.user}:${this.password}@localhost:${this.dbPort}/${this.dbName}?connection_limit=&socket_timeout=5`;
        const dbConnection: mySQL.Connection  = mySQL.createConnection(url);

        try {
            CheckerDatabaseConnectionService(dbConnection);
        } catch (err: any) {
            this.loggerFormat.logError(err.message, err);
            throw new ExceptionHandlerError(
                err.message,
                "MysqlError",
                err.code = "ER_ACCESS_DENIED_ERROR"
                    ? HttpStatusCodesConstant.UNAUTHORIZED
                    : HttpStatusCodesConstant.GONE,
                true
            );
        }
    }
}