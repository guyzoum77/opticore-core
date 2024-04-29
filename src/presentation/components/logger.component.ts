import {LoggerFormat} from "./sharedModules.component";

export class LoggerComponent {
    private static logger: LoggerFormat = new LoggerFormat();

    static logSuccessMessage (successMessage: string | any, author: string | any) {
        this.logger.createLogInFile(
            successMessage,
            { date: new Date(), level: "info", message: successMessage, author: author }
        );
        this.logger.logInfo(
            successMessage,
            { date: new Date(), level: "info", message: successMessage, author: author }
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