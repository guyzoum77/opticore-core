import {getEnvVariable} from "../../../domain/env/access.env";

/** --------------------------------------------------------------------------------------------------------------------------------
 * Arguments : A connection URL can also take arguments. Here is the same example from above with placeholder
 * values in uppercase letters for three arguments: mysql://USER:PASSWORD@HOST:PORT/DATABASE?KEY1=VALUE&KEY2=VALUE&KEY3=VALUE
 *
 * The following arguments can be used:
 * connection_limit: Maximum size of the connection pool,
 * connect_timeout: Maximum number of seconds to wait for a new connection to be opened, 0 means no timeout,
 * pool_timeout: Maximum number of seconds to wait for a new connection from the pool, 0 means no timeout,
 * sslcert: Path to the server certificate. Certificate paths are resolved relative to the ./prisma folder,
 * sslidentity: Path to the PKCS12 certificate,
 * sslpassword: Password that was used to secure the PKCS12 file,
 * sslaccept: Configures whether to check for missing values in the certificate. Possible values: accept_invalid_certs, strict,
 * socket: Points to a directory that contains a socket to be used for the connection,
 * socket_timeout: Number of seconds to wait until a single query terminates
 *
 * So if you want to use argument : write it like this "?sslidentity=client-identity.p12&sslpassword=mypassword&sslcert=rootca.cert"
 *
 * ---------------------------------------------------------------------------------------------------------------------------------
 */
export const optionalArgumentConnectionUtil: string = getEnvVariable.argumentsDatabaseConnection;