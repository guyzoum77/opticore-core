import { injectable } from "inversify";
import winston, { format } from "winston";
import { LogLevelEnum } from "../../../domain/enums/logLevel.enum";
import {colors, DailyRotateFile, fs} from "../../..";


export type LogMessage = string;
export type LogContext = object;


/**
 * A class to log in production all interaction with the application.
 */
@injectable()
export default class LoggerUtils {
    private _logger: winston.Logger;
    private static logDirectory: string | undefined = "./logs";

    constructor() {
        this._logger = this._initializeWinston();
        this._createLogDir();
    }

    public logInfo(msg: LogMessage, context?: LogContext): void {
        this._log(msg, LogLevelEnum.INFO, context);
    }
    public logWarn(msg: LogMessage, context?: LogContext): void {
        this._log(msg, LogLevelEnum.WARN, context);
    }
    public logError(msg: LogMessage, context?: LogContext): void {
        this._log(msg, LogLevelEnum.ERROR, context);
    }
    public logDebug(msg: LogMessage, context?: LogContext): void {
        if (process.env.NODE_ENV !== "production") {
            this._log(msg, LogLevelEnum.DEBUG, context); // Don"t log debug in production
        }
    }

    public createLogInFile(msg: LogMessage, context?: LogContext): winston.Logger {
        return winston.createLogger({
            transports: LoggerUtils._getTransports("development", "dev"),
        });
    }

    private _createLogDir (): string | undefined {
        if (!fs.existsSync(LoggerUtils.logDirectory!)) {
            try {
                return fs.mkdirSync(LoggerUtils.logDirectory!!, { recursive: true });
            } catch (error) {
                console.error("Error creating log directory:", error);
                throw error;
            }
        }
    }

    private _log(msg: LogMessage, level: LogLevelEnum, context?: LogContext): void {
        this._logger.log(level, msg, {context});
    }

    private _initializeWinston() {
        return winston.createLogger({
            transports: LoggerUtils._getTransports("production", "prod"),
        });
    }

    private static _getTransports(env: string, logFileName: string): any[] {
        const transports: any[] = [
            new winston.transports.Console({
                format: this._getFormatForConsole(),
            }),
        ];

        if (process.env.NODE_ENV === env) {
            transports.push(this._getFileTransport(logFileName)); // Also log file in production
        }

        return transports;
    }

    private static _getFormatForConsole(): winston.Logform.Format {
        return format.combine(
            format.timestamp(),
            format.printf((info: any) => {
                return `${colors.blue(`${new Date(info.timestamp)}`)} [${info.level}] ${info.message} ${new Date(info.timestamp).toLocaleTimeString()}`
            }),
            format.colorize({all: true})
        );
    }

    private static _getFileTransport(logFileName: string): DailyRotateFile {
        return new DailyRotateFile({
            filename: `${logFileName}-%DATE%.log`,
            dirname: this.logDirectory,
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '14d',
            format: format.combine(
                format.timestamp(),
                format((info: any) => {
                    console.log(info);
                    info.app = logFileName;
                    return info;
                })(),
                format.json()
            ),
        });
    }
}