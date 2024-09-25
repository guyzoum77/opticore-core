import {
    crypto,
    Exception as msg,
    ExceptionHandlerError as ErrorHandler,
    HttpStatusCodesConstant as status,
    LogMessageUtils as log,
    RSAKeyDecryption,
    RSAKeyEncryption
} from "../../index";
import StackTraceError from "../../core/handlers/errors/base/stackTraceError";


export default class AsymmetricCryptionDataWithPrivateRSAKeyService {

    /**
     *
     * @param rsaKey
     * @param keyType
     * @protected
     *
     * Return ErrorHandler | string
     */
    protected static verifyExistingKey(rsaKey: string, keyType: string): ErrorHandler | string {
        if (!rsaKey) {
            const stackTrace: StackTraceError = this.traceError(
                keyType +" "+ msg.rsaKeyNotFound,
                msg.ER_BAD_DB_ERROR,
                status.NOT_FOUND
            );
            log.error(
                msg.verifyExistingKey,
                msg.ER_BAD_DB_ERROR,
                stackTrace.stack,
                msg.rsaKeyNotFound,
                status.NOT_FOUND
            );

            return stackTrace;
        }
        return rsaKey;
    }

    /**
     *
     * @param privateKey
     * @param payload
     * @private
     *
     * Return Buffer
     */
    private static encryptionWithPrivateKey(privateKey: string, payload: any): Buffer {
        this.verifyExistingKey(privateKey, "Private");

        try {
            const bufferedData: Buffer = Buffer.from(payload, "utf-8");
            return RSAKeyEncryption.privateEncrypt(privateKey, bufferedData);
        } catch (err: any) {
            const stackTrace: StackTraceError = this.traceError(
                msg.encryptionWithPrivateKeyFailed,
                msg.encryptionFailed,
                status.NOT_FOUND
            );
            log.error(
                msg.encryptionWithPrivateKeyFailed,
                msg.encryptionFailed,
                stackTrace.stack!,
                err.message,
                status.NOT_FOUND
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
    private static decryptionWithPublicKey(privateKey: string, publicKey: string, payload: any): Buffer {
        this.verifyExistingKey(publicKey, "Public");

        try {
            const encryptedPayload: Buffer = this.encryptionWithPrivateKey(privateKey, payload);
            return RSAKeyDecryption.publicDecrypt(publicKey, encryptedPayload);
        } catch (error: any) {
            const stackTrace: StackTraceError = this.traceError(
                msg.errorDecryption,
                msg.decryptionFailed,
                status.NOT_ACCEPTABLE
            );
            log.error(
                msg.decryptionWithPublicKeyFailed,
                msg.decryptionFailed,
                stackTrace.stack!,
                msg.errorDecryption,
                status.NOT_ACCEPTABLE
            );
            throw new Error(error.message);
        }
    }

    /**
     *
     * @param privateKey
     * @param payload
     * @private
     */
    private static signWithRSAKey(privateKey: string, payload: any): string {
        this.verifyExistingKey(privateKey, "Private");

        const sign: crypto.Sign = crypto.createSign('SHA256');
        sign.update(payload);

        return sign.sign(privateKey, 'base64');
    }

    /**
     *
     * @param privateKey
     * @param publicKey
     * @param payload
     */
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
                const stackTrace: StackTraceError = this.traceError(
                    msg.signatureRSAKeyFailed,
                    msg.verifyRSAKeyFailed,
                    status.NOT_ACCEPTABLE
                );
                log.error(
                    msg.verifyRSAKey,
                    msg.verifyRSAKeyFailed,
                    stackTrace.stack!,
                    msg.signatureRSAKeyFailed,
                    status.NOT_FOUND
                );

                return stackTrace;
            }

        } catch (err: any) {
            const stackTrace: StackTraceError = this.traceError(err.name, msg.signatureRSAKeysError, status.NOT_ACCEPTABLE);
            log.error(
                msg.signatureRSAKeysError,
                msg.errorNameNotVerifyingRSAKey,
                stackTrace.stack!,
                err.message,
                status.NOT_FOUND
            );

            throw new Error(err.message);
        }
    }

    /**
     *
     * @param props
     * @param name
     * @param status
     * @private
     */
    private static traceError(props: string, name: string, status: number): StackTraceError {
        return new ErrorHandler(props, name, status, true);
    }
}