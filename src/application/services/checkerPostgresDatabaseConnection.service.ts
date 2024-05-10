import {Client, LoggerComponent, CustomTypesConfig} from "../..";
import {ConnectionOptions} from "tls";
import stream from "stream";

export default async function CheckerPostgresDatabaseConnectionService(
    connectionString: string | any, keepAlive?: boolean | undefined, stream?: () => stream.Duplex | undefined,
    statement_timeout?: false | number | undefined, ssl?: boolean | ConnectionOptions | undefined,
    query_timeout?: number | undefined, keepAliveInitialDelayMillis?: number | undefined,
    idle_in_transaction_session_timeout?: number | undefined, application_name?: string | undefined,
    connectionTimeoutMillis?: number | undefined, types?: CustomTypesConfig | undefined, options?: string | undefined) {
    const client: Client = new Client({
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
    });
    await client.connect();
    await client.end().then(
        (): void => {
            LoggerComponent.logSuccessMessage("Connection closed successfully", "Postgres close connection");
        },
        (onRejected: any) => {
            LoggerComponent.logSuccessMessage(onRejected, "Postgres connection");
        }).catch((onError: any) => {
            LoggerComponent.logSuccessMessage(onError, "Postgres connection");
        });
}