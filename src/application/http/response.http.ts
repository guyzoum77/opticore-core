import {express, Validator} from "../../index";

export class ResponseHttp {
    /**
     *
     * @param res
     * @param status
     * @param message
     * @param apiVersion
     */
    static error(res: express.Response,
                    status: number,
                    message: string | Validator.ValidationErrors,
                    apiVersion: any): express.Response<any, Record<string, any>> {
        return res.status(status).json({
            errorMessage: message,
            responseStatus: status,
            version: apiVersion
        });
    }

    /**
     *
     * @param res
     * @param status
     * @param context
     * @param successMessage
     * @param apiVersion
     */
    static success(res: express.Response,
                    status: number,
                    context: string,
                    successMessage: string,
                    apiVersion: any): express.Response<any, Record<string, any>> {
        return res.status(200).json({
            "@context": context,
            message: successMessage,
            responseStatus: status,
            version: apiVersion
        });
    }

    /**
     *
     * @param res
     * @param status
     * @param context
     * @param successMessage
     * @param data
     * @param apiVersion
     */
    static successWithData (res: express.Response,
                     status: number,
                     context: string,
                     successMessage: string,
                     data: any,
                     apiVersion: any): express.Response<any, Record<string, any>> {
        return res.status(200).json({
            "@context": context,
            message: successMessage,
            dataResponse: data,
            responseStatus: status,
            version: apiVersion
        });
    }
}