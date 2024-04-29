import {
    Exception, HttpStatusCodesConstant as statusCode, LoggerComponent, RSAKeyDecryption, RSAKeyEncryption, crypto,
    ExceptionHandlerError
} from "../../index";


export default class AsymmetricCryptionDataWithPrivateRSAKeyService {
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

    private static encryptionWithPrivateKey(privateKey: string, payload: any): Buffer {
        this.verifyExistingKey(privateKey, "Private");

        try {
            const bufferedData: Buffer = Buffer.from(payload, "utf-8");
            return RSAKeyEncryption.privateEncrypt(privateKey, bufferedData);
        } catch (err: any) {
            throw new ExceptionHandlerError(
                err.message,
                Exception.errorEncryptionPrivateKey,
                statusCode.NOT_ACCEPTABLE,
                true
            );
        }
    }

    private static decryptionWithPublicKey(privateKey: string, publicKey: string, payload: any): Buffer {
        this.verifyExistingKey(publicKey, "Public");

        try {
            const encryptedPayload: Buffer = this.encryptionWithPrivateKey(privateKey, payload);
            return RSAKeyDecryption.publicDecrypt(publicKey, encryptedPayload);
        } catch (error: any) {
            throw new ExceptionHandlerError(
                error.message,
                Exception.errorDecryption,
                statusCode.NOT_ACCEPTABLE,
                true
            );
        }
    }

    private static signWithRSAKey(privateKey: string, payload: any): string {
        this.verifyExistingKey(privateKey, "Private");

        const sign: crypto.Sign = crypto.createSign('SHA256');
        sign.update(payload);

        return sign.sign(privateKey, 'base64');
    }

    public static verifyRSAKey(privateKey: string, publicKey: string, payload: any) {
        try {
            const verify: crypto.Verify = crypto.createVerify('SHA256');
            verify.update(payload);

            const signature: string = this.signWithRSAKey(privateKey, payload);
            const isVerified: boolean = verify.verify(publicKey, signature, 'base64');
            if (isVerified) {
                const decryptedData: Buffer = this.decryptionWithPublicKey(privateKey, publicKey, payload);
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