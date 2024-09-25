import {colors, modulesLoadedUtils as loadedModules} from "../../index";

export class MessagesException {
    static dbConnection: string = "DataBase connection";
    static dbConnectionClosed: string = "MySQL connection is closed";
    static mysqlErrorCon: string = "MysqlError connection";
    static mySQLError: string = "MysqlError";
    static mySqlCloseConnection: string = "MySql close connection";
    static verifyExistingKey: string = "Verify Existing Key";
    static invalidRequest: string = "Invalid request";
    static tokenNotProvided: string = "No token provided.";


    static ExpiresToken: string = "Expires Token. You're not authorize";
    static privateKeyNotExist: string = "A private key doesn't exist.";
    static publicKeyNotExist: string = "A public key doesn't exist.";
    static errorNamePublicKeyNotExist: string = "No public key";
    static errorAuthorPublicKeyNotExist: string = "PublicKey not existing";
    static errorDecryption: string = "Error decryption with private key";
    static rsaKeyNotFound: string = "RSA key provided is not found.";
    static notVerifyingRSAKey: string = "Not verify RSA Key";
    static errorNameNotVerifyingRSAKey: string = "Error Verify RSA Key";
    static errorEncryptionPublicKey: string = "Error encryption with public key";
    static errorEncryptionPrivateKey: string = "Error encryption with private key";
    static errorNameRsaVerifyExistingKey: string = "Verify existing key";
    static signatureRSAKeyFailed: string = "Signature verification failed.";
    static encryptionWithPrivateKeyFailed: string = "Encryption With PrivateKey";
    static encryptionFailed: string = "Encryption failed";
    static decryptionWithPublicKeyFailed: string = "Decryption With PublicKey";
    static decryptionFailed: string = "Decryption failed";
    static verifyRSAKey: string = "Verify RSA Keys";
    static verifyRSAKeyFailed: string = "Verify RSA Keys Failed";
    static notVerifying: string = "Verification failed";
    static signatureRSAKeysError: string = "Signature RSA Keys Error";
    static encryptionWithPublicKey: string = "Encryption error";
    static errorDecryptionWithPrivateKey: string = "Error Decryption With PrivateKey";
    static verifyPublicRSAKey: string = "Verify Public RSA Key";
    static PostgresDBConnectionChecker: string = "PostgresDB Connection Checker";
    static PostgresConnection: string = "connection";
    static MongoDBConnectionChecker: string = "MongoDB Connection Checker";
    static MongoConnection: string = "connection";
    static mongoDBAuthentication: string = "authentication";
    static mongoDBConnection: string = "MongoDB connection";
    static mongoDBAuthenticationFailed: string = "failed";
    static mongoDBUnableParsingUrl: string = "unable to parse";
    static mongoDBConnectionUrl: string = "url";
    static mongoDBServerSelection: string = "MongoServer selection error";
    static mongoDBServer: string = "MongoServer";
    static mongoDBConnectionError: string = "connection error";
    static mongoDBError: string = "error";
    static loadedModules: string = "Loading core modules";


    // Message success
    static dbConnexionSuccess: string = "The database connection was successful  🚀";
    static mongoConnectionSuccess: string = "Connection to database is successfully.";
    static PostgresConnectionSuccess: string = "Connection to database is successfully.";

    // Message error
    static userNotExistError: string = "User do not exist.";
    static wrongPasswordError: string = "Password incorrect";
    static middlewareError: string = "error from UserAuthenticateMiddleware";
    static dbConnexionError: string = "An error occurred while connecting to the database";
    static verifyPublicKeyError: string = "After checking, we noticed that someone tried to recover data, but to no avail.";
    static verifyPrivateKeyError: string = "After checking, we noticed that someone tried to recover data, but to no avail.";
    static UnableAccountError: string = "Oops... your account is inactive. Please verify your email account or spam to confirm your registration. Or try to contact the admin if you doesn't receive email account registration."
    static erNotSupportedAuthModeError: string = "Oops ! Database credentials (user and password) are not correct.";
    static verifyPublicRSAKeyError: string = "Public RSA Key verification is failed";
    static mongoDBAuthenticationError: string = "Authentication failed, be sure the credentials is correct.";
    static loadedModulesError: string = "Required core modules are not loaded properly";
    static verifyExistingKeyError: string = "The provided key is not found";


    //
    static webServer: string = "Web server";
    static listening: string = "listening";
    static webHost: string = "host";
    static badHost: string = "bad host";
    static hostNotFound: string = "not found";
    static errorHostUrl: string = "The host and port are not define, please define them in .env";
    static badPort: string = "bad port";
    static errorPort: string = "The port is not correct. Please define a right port with number port.";
    static errorHost: string = "The host can't be empty or blank. Please define a string host in .env";

    static ER_BAD_DB_ERROR: string = "ER_BAD_DB_ERROR";
    static ER_ACCESS_DENIED_ERROR: string = "ER_ACCESS_DENIED_ERROR";
    static ER_NOT_SUPPORTED_AUTH_MODE: string = "ER_NOT_SUPPORTED_AUTH_MODE";
    static EAI_AGAIN: string = "EAI_AGAIN";

    static accessDeniedToDBCon(user: string, password: string): string {
        return `Access denied for user ${user}. Database credentials in .env file are User: ${user} and Password: ${password}.  '${user}''${password}'@'localhost'. Try to set user and password in .env file`;
    }
    static unknownDB(password: string): string {
        return `Database ${password} is unknown. Please try to use Database CLI to create your database, or do it manually in your Database Management System`
    }

    static errorDBHost(host: string): string {
        return `A database host ${host} does not allow connection. Please either set the host like this: ${colors.bgRed(`${colors.white(`localhost`)}`)} in your .env file`;
    }
}