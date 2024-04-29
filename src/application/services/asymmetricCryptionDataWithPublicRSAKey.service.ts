import {
    Exception,
    ExceptionHandlerError,
    LoggerComponent,
    HttpStatusCodesConstant as statusCode,
    RSAKeyEncryption,
    RSAKeyDecryption,
    crypto
} from "../../index";


export default class AsymmetricCryptionDataWithPublicRSAKeyService {
    protected static verifyExistingKey(rsaKey: string, keyType: string): ExceptionHandlerError | string {
        if (!rsaKey) {
            LoggerComponent.logErrorMessage(keyType + Exception.rsaKeyNotFound, Exception.errorNameRsaVerifyExistingKey);
            return new ExceptionHandlerError(
                keyType + Exception.rsaKeyNotFound,
                Exception.errorNameRsaVerifyExistingKey,
                statusCode.NOT_FOUND,
                true
            );
        }
        return rsaKey;
    }

    private static encryptionWithPublicKey(publicKey: string, payload: any): Buffer {
        this.verifyExistingKey(publicKey, "Public");

        try {
            const bufferedData: Buffer = Buffer.from(payload, "utf-8");
            return RSAKeyEncryption.publicEncrypt(publicKey, bufferedData);
        } catch (err: any) {
            throw new ExceptionHandlerError(
                err.message,
                Exception.errorEncryptionPublicKey,
                statusCode.NOT_ACCEPTABLE,
                true
            );
        }
    }

    private static decryptionWithPrivateKey(privateKey: string, publicKey: string, payload: any): Buffer {
        this.verifyExistingKey(publicKey, "Public");

        try {
            const encryptedPayload: Buffer = this.encryptionWithPublicKey(publicKey, payload);
            return RSAKeyDecryption.privateDecrypt(privateKey, encryptedPayload);
        } catch (err: any) {
            throw new ExceptionHandlerError(
                err.message,
                Exception.errorDecryption,
                statusCode.NOT_ACCEPTABLE,
                true
            );
        }
    }

    private static signWithPublicRSAKey(publicKey: string, payload: any): string {
        this.verifyExistingKey(publicKey, "Private");

        const sign: crypto.Sign = crypto.createSign('SHA256');
        sign.update(payload);

        return sign.sign(publicKey, 'base64');
    }

    public static verifyPublicRSAKey(privateKey: string, publicKey: string, payload: any) {
        try {
            const verify: crypto.Verify = crypto.createVerify('SHA256');
            verify.update(payload);

            const signature: string = this.signWithPublicRSAKey(publicKey, payload);
            const isVerified: boolean = verify.verify(publicKey, signature, 'base64');

            if (isVerified) {
                const decryptedData: Buffer = this.decryptionWithPrivateKey(privateKey, publicKey, payload);
                return decryptedData.toString("utf-8");

            } else {
                LoggerComponent.logErrorMessage(Exception.signatureRSAKeyFailed, Exception.notVerifyingRSAKey);
                return new ExceptionHandlerError(
                    Exception.signatureRSAKeyFailed,
                    Exception.notVerifyingRSAKey,
                    statusCode.NOT_FOUND,
                    true
                );
            }
        } catch (err: any) {
            LoggerComponent.logErrorMessage(err.message, Exception.errorNameNotVerifyingRSAKey);
            return new ExceptionHandlerError(
                Exception.signatureRSAKeyFailed,
                Exception.errorNameNotVerifyingRSAKey,
                statusCode.NOT_ACCEPTABLE,
                true
            );
        }
    }
}