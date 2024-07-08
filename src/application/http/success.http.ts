import {express} from "../../index";

export default class SuccessHttp {
    /**
     *
     * @param res
     * @param status
     * @param context
     * @param successMessage
     * @param apiVersion
     */
    static response(res: express.Response,
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
}