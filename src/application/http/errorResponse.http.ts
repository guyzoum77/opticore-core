import {express, Validator} from "../../index";

export default class ErrorResponseHttp {
    /**
     *
     * @param res
     * @param status
     * @param message
     * @param apiVersion
     */
    static response(res: express.Response,
                    status: number,
                    message: string | Validator.ValidationErrors,
                    apiVersion: any): express.Response<any, Record<string, any>> {
        return res.status(status).json({
            errorMessage: message,
            responseStatus: status,
            version: apiVersion
        });
    }
}