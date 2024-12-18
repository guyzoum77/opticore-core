    import colors from "ansi-colors";
import {dateTimeFormattedUtils} from "./dateTimeFormatted.utils";

export class LogMessageUtils {
    static success(title: string, action: string, contentAction: string): void {
        console.log(`${colors.green(`✔`)} ${colors.bgGreen(` ${colors.bold(`${colors.white(`${title}`)}`)} `)}  ${dateTimeFormattedUtils} | ${colors.bgGreen(`${colors.white(` Success `)}`)} [ ${action} ] ${contentAction} - [ Status ] ${colors.bgGreen(`${colors.white(` 200 `)}`)}`);
    }
    static warning(title: string, action: string, contentAction: string): void {
        console.warn(`${colors.yellow(`⚠️`)} ${colors.bgYellow(` ${colors.bold(`${colors.white(`${title}`)}`)} `)}  ${dateTimeFormattedUtils} | ${colors.bgYellow(`${colors.white(` Warning `)}`)} ${contentAction}`);
    }
    static info(title: string, action: string, contentAction: string): void {
        console.info(`${colors.cyan(`ⓘ`)} ${colors.bgCyan(` ${colors.bold(`${colors.white(`${title}`)}`)} `)}  ${dateTimeFormattedUtils} | ${colors.bgCyan(`${colors.white(` Info `)}`)} ${contentAction}`);
    }
    static error(title: string, errorType: any, stackTrace: any, messageContent: any, httpCodeValue: number): void {
        console.error(`${colors.red(`✘`)} ${colors.bgRed(` ${colors.bold(`${colors.white(`${title}`)}`)} `)} | ${dateTimeFormattedUtils} | [ ${colors.red(`${colors.bold(` ${errorType} `)}`)} ] | [ ${colors.bold(`stack trace`)} ] ${colors.red(`${stackTrace}`)} - ${colors.red(`${messageContent}`)} - [ ${colors.red(`${colors.bold(` HttpCode `)}`)} ] ${colors.red(`${colors.bold(` ${httpCodeValue} `)}`)} `);
    }
    static requestError(title: string, errorName: string, errorMessage: string, errorCode: number): void {
        console.error(`[ ${colors.red(`${title}`)} ] ${dateTimeFormattedUtils} | ${colors.bgRed(`${colors.white(` ERROR `)}`)} ${colors.red(`[ ${errorName} ]`)} ${colors.red(`${errorMessage}`)} - [ Status ] ${colors.bgRed(`${colors.white(` ${errorCode} `)}`)}`);
    }
}