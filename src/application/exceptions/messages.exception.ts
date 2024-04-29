export default class MessagesException {
    static dbConnexionSuccess: string = "The database connection was successful  🚀";
    static dbConnexionError: string = "An error occurred while connecting to the database";
    static dbConnexionClosed: string = "MySQL connection is closed";
    static mySQLError: string = "MysqlError";
    static userNotExist: string = "User do not exist.";
    static wrongPassword: string = "Password incorrect";
    static tokenNotProvided: string = "No token provided.";
    static middlewareError: string = "error from UserAuthenticateMiddleware";
    static ExpiresToken: string = "Expires Token. You're not authorize";
    static privateKeyNotExist: string = "A private key doesn't exist.";
    static publicKeyNotExist: string = "A public key doesn't exist.";
    static errorNamePublicKeyNotExist: string = "No public key";
    static errorAuthorPublicKeyNotExist: string = "PublicKey not existing";
    static errorDecryption: string = "Error decryption with public key";
    static rsaKeyNotFound: string = "RSA key provided is not found.";
    static notVerifyingRSAKey: string = "Not verify RSA Key";
    static errorNameNotVerifyingRSAKey: string = "Error Verify RSA Key";
    static errorEncryptionPublicKey: string = "Error encryption with public key";
    static errorEncryptionPrivateKey: string = "Error encryption with private key";
    static errorNameRsaVerifyExistingKey: string = "Verify existing key";
    static signatureRSAKeyFailed: string = "Signature verification failed.";
    static verifyPublicKeyError: string = "After checking, we noticed that someone tried to recover data, but to no avail.";
    static verifyPrivateKeyError: string = "After checking, we noticed that someone tried to recover data, but to no avail.";
    static UnableAccount = "Oops... your account is inactive. Please verify your email account or spam to confirm your registration. Or try to contact the admin if you doesn't receive email account registration."
}