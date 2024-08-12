import LoggerFormat from "../../core/utils/logs/logger.utils";
import {colors} from "../../index";

export class LoggerComponent {
    private static logger: LoggerFormat = new LoggerFormat();

    static logInfoMessage (infoMessage: string | any, author: string | any): void {
        this.logger.createLogInFile(
            infoMessage,
            { date: `${colors.blue(`${new Date()}`)}`, level: `${colors.bgGreen(`${colors.white("info")}`)}`, message: infoMessage, author: author }
        );
    }
    static logWarnMessage (warnMessage: string | any, author: string | any): void {
        this.logger.createLogInFile(
            warnMessage,
            { date: `${colors.blue(`${new Date()}`)}`, level: `${colors.bgCyan(`${colors.white("warn")}`)}`, message: warnMessage, author: author }
        );
    }
    static logErrorMessage (errorMessage: string | any, author: string | any): void  {
        this.logger.createLogInFile(
            errorMessage,
            { date: `${colors.blue(`${new Date()}`)}`, level: `${colors.bgRed(`${colors.white("error")}`)}`, message: errorMessage, author: author }
        );
    }
}