import LoggerFormat from "../../core/utils/logs/logger.utils";

export class LoggerComponent {
    private static logger: LoggerFormat = new LoggerFormat();

    static logInfoMessage (infoMessage: string | any, author: string | any) {
        this.logger.createLogInFile(
            infoMessage,
            { date: new Date(), level: "info", message: infoMessage, author: author }
        );
        this.logger.logInfo(
            infoMessage,
            { date: new Date(), level: "info", message: infoMessage, author: author }
        );
    }
    static logSuccessMessage (successMessage: string | any, author: string | any) {
        this.logger.createLogInFile(
            successMessage,
            { date: new Date(), level: "success", message: successMessage, author: author }
        );
        this.logger.logInfo(
            successMessage,
            { date: new Date(), level: "success", message: successMessage, author: author }
        );
    }

    static logErrorMessage (errorMessage: string | any, author: string | any)  {
        this.logger.createLogInFile(
            errorMessage,
            { date: new Date(), level: "error", message: errorMessage, author: author }
        );
        this.logger.logError(
            errorMessage,
            { date: new Date(), level: "error", message: errorMessage, author: author }
        );
    }
}