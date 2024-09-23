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
                keyType + msg.rsaKeyNotFound,
                msg.errorNameRsaVerifyExistingKey,
                status.NOT_FOUND
            );
            log.error(
                msg.verifyExistingKey,
                msg.mySQLError,
                msg.ER_BAD_DB_ERROR,
                stackTrace.name,
                stackTrace.stack!,
                msg.errorNameRsaVerifyExistingKey,
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
                err.name,
                status.NOT_FOUND
            );
            log.error(
                msg.encryptionWithPrivateKeyFailed,
                msg.encryptionFailed,
                err.code,
                stackTrace.name,
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
            const stackTrace: StackTraceError = this.traceError(msg.errorDecryption, error.name, status.NOT_ACCEPTABLE);
            log.error(
                msg.decryptionWithPublicKeyFailed,
                msg.decryptionFailed,
                error.code,
                stackTrace.name,
                stackTrace.stack!,
                error.message,
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
                    msg.notVerifyingRSAKey,
                    status.NOT_ACCEPTABLE
                );
                log.error(
                    msg.verifyRSAKey,
                    msg.verifyRSAKeyFailed,
                    msg.notVerifying,
                    stackTrace.name,
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
                err.code,
                stackTrace.name,
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