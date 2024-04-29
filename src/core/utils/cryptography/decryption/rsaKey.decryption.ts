import crypto from "crypto";


/**
 * This class contains methods that allow to decrypt data using public and private keys.
 */
export class RSAKeyDecryption {
    static privateDecrypt(privateKey: any, decryptData: any): Buffer {
        const rsaPrivateKey = {
            key: privateKey
        };

        return crypto.privateDecrypt(rsaPrivateKey, decryptData);
    }

    static publicDecrypt(publicKey: any, decryptData: any): Buffer {
        const rsaPublicKey = {
            key: publicKey
        };

        return crypto.publicDecrypt(rsaPublicKey, decryptData);
    }
}