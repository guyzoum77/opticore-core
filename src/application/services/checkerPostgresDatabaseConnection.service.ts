import {Client, CustomTypesConfig, HttpStatusCodesConstant} from "../..";
import {ConnectionOptions} from "tls";
import {LogMessageUtils} from "../../core/utils/logMessage.utils";

export default async function CheckerPostgresDatabaseConnectionService(connectionString: any,
                                                                       keepAlive?: boolean | undefined,
                                                                       stream?: any,
                                                                       statement_timeout?: false | number | undefined,
                                                                       ssl?: boolean | ConnectionOptions | undefined,
                                                                       query_timeout?: number | undefined,
                                                                       keepAliveInitialDelayMillis?: number | undefined,
                                                                       idle_in_transaction_session_timeout?: number | undefined,
                                                                       application_name?: string | undefined,
                                                                       connectionTimeoutMillis?: number | undefined,
                                                                       types?: CustomTypesConfig | undefined,
                                                                       options?: string | undefined): Promise<void> {
    const configOptions = {
        connectionString: connectionString,
        keepAlive: keepAlive,
        stream: stream,
        statement_timeout: statement_timeout,
        ssl: ssl,
        query_timeout: query_timeout,
        keepAliveInitialDelayMillis: keepAliveInitialDelayMillis,
        idle_in_transaction_session_timeout: idle_in_transaction_session_timeout,
        application_name: application_name,
        connectionTimeoutMillis: connectionTimeoutMillis,
        types: types,
        options: options
    };
    const client: Client = new Client(configOptions);
    await client.connect();
    await client.end().then(
        (): void => {
            LogMessageUtils.success(
                "Postgres client end success",
                "Connection closed successfully",
                "Postgres client is close connection.",
            );
        },
        (onRejected: any): void => {
            LogMessageUtils.error("Postgres client end error",
                "Rejected",
                "Postgres client end rejected",
                "End client rejected",
                "Rejected",
                onRejected,
                HttpStatusCodesConstant.BAD_REQUEST
            );
        }
    ).catch((onError: any): void => {
        LogMessageUtils.error("Postgres connection error",
            "Exception",
            "Error exception",
            "Exception handling",
            "Postgres connection exception handling",
            onError.message,
            HttpStatusCodesConstant.BAD_REQUEST
        );
    });
}