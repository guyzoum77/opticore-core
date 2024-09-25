import {
    Exception as msg,
    RSAKeyEncryption,
    RSAKeyDecryption,
    crypto, ExceptionHandlerError as ErrorHandler,
    HttpStatusCodesConstant as status,
    LogMessageUtils as log
} from "../../index";
import StackTraceError from "../../core/handlers/errors/base/stackTraceError";


export default class AsymmetricCryptionDataWithPublicRSAKeyService {
    /**
     *
     * @param rsaKey
     * @param keyType
     * @protected
     */
    protected static verifyExistingKey(rsaKey: string, keyType: string): ErrorHandler | string {
        if (!rsaKey) {
            const stackTrace: StackTraceError = this.traceError(
                keyType + msg.verifyExistingKey,
                msg.verifyExistingKey,
                status.NOT_FOUND
            );
            log.error(
                msg.verifyExistingKey,
                "key verification",
                stackTrace.stack!,
                msg.verifyExistingKeyError,
                status.NOT_FOUND
            );
            return stackTrace;
        }

        return rsaKey;
    }

    /**
     *
     * @param publicKey
     * @param payload
     * @private
     */
    private static encryptionWithPublicKey(publicKey: string, payload: any): Buffer {
        this.verifyExistingKey(publicKey, "Public");

        try {
            const bufferedData: Buffer = Buffer.from(payload, "utf-8");
            return RSAKeyEncryption.publicEncrypt(publicKey, bufferedData);
        } catch (err: any) {
            const stackTrace: StackTraceError = this.traceError(
                err.message,
                msg.encryptionWithPublicKey,
                status.NOT_ACCEPTABLE
            );
            log.error(
                msg.errorEncryptionPublicKey,
                msg.encryptionWithPublicKey,
                stackTrace.stack,
                err.message,
                status.NOT_ACCEPTABLE
            );

            throw new Error(err.message);
        }
    }

    /**
     *
     * @param privateKey
     * @param publicKey
     * @param payload
     * @private
     */
    private static decryptionWithPrivateKey(privateKey: string, publicKey: string, payload: any): Buffer {
        this.verifyExistingKey(publicKey, "Public");

        try {
            const encryptedPayload: Buffer = this.encryptionWithPublicKey(publicKey, payload);
            return RSAKeyDecryption.privateDecrypt(privateKey, encryptedPayload);
        } catch (err: any) {
            const stackTrace: StackTraceError = this.traceError(err.code, msg.errorDecryption, status.NOT_ACCEPTABLE);
            log.error(
                msg.errorDecryptionWithPrivateKey,
                msg.errorDecryption,
                stackTrace.stack!,
                err.message,
                status.NOT_ACCEPTABLE
            );

            throw new Error(err.message);
        }
    }

    /**
     *
     * @param publicKey
     * @param payload
     * @private
     */
    private static signWithPublicRSAKey(publicKey: string, payload: any): string {
        this.verifyExistingKey(publicKey, "Private");

        const sign: crypto.Sign = crypto.createSign('SHA256');
        sign.update(payload);

        return sign.sign(publicKey, 'base64');
    }

    /**
     *
     * @param privateKey
     * @param publicKey
     * @param payload
     */
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
                const stackTrace: StackTraceError = this.traceError(
                    msg.verifyPublicRSAKeyError,
                    msg.signatureRSAKeyFailed,
                    status.NOT_FOUND
                );
                log.error(
                    msg.verifyPublicRSAKey,
                    msg.signatureRSAKeyFailed,
                    stackTrace.stack,
                    msg.verifyPublicRSAKeyError,
                    status.NOT_FOUND
                );
                return stackTrace;
            }
        } catch (err: any) {
            const stackTrace: StackTraceError = this.traceError(err.code, msg.verifyPublicRSAKey, status.NOT_ACCEPTABLE);
            log.error(
                msg.verifyPublicRSAKey,
                msg.errorDecryption,
                stackTrace.stack,
                err.message,
                status.NOT_ACCEPTABLE
            );

            throw new Error(err.message);
        }
    }

    private static traceError(props: string, name: string, status: number): StackTraceError {
        return new ErrorHandler(props, name, status, true);
    }
}