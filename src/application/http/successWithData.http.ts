import {express} from "../../index";

export default class SuccessWithDataHttp {
    /**
     *
     * @param res
     * @param status
     * @param context
     * @param successMessage
     * @param data
     * @param apiVersion
     */
    static response (res: express.Response,
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