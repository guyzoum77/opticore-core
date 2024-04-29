import {crypto} from "../../../../presentation/components/sharedModules.component";


/**
 * This class contains methods which allow to encrypt data by passing as arguments
 * the public/private keys and the data to be encrypted.
 */
export class RSAKeyEncryption {
    static privateEncrypt(privateKey: any, encryptData: any): Buffer {
        const rsaPrivateKey = {
            key: privateKey
        };
        const bufferData: Buffer = Buffer.from(encryptData, "utf8");

        return crypto.privateEncrypt(rsaPrivateKey, bufferData);
    }

    static publicEncrypt(publicKey: any, encryptData: any): Buffer {
        const rsaPublicKey = {
            key: publicKey
        };
        const bufferData: Buffer = Buffer.from(encryptData, "utf8");

        return crypto.publicEncrypt(rsaPublicKey, bufferData);
    }
}