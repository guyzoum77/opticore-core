import {colors} from "../../index";
import {dateTimeFormattedUtils} from "./dateTimeFormatted.utils";

export function logMessageUtils(title: string, action: any, typeActionTitle: any, typeActionDescribe: any, 
                                messageTitle: string, messageContent: any, httpCodeValue: number): void {
    console.log(`[ ${colors.red(`${colors.bold(`${title}`)}`)} ] | ${dateTimeFormattedUtils()} | [ ${colors.red(`${colors.bold(`${action}`)}`)} ] | [ ${colors.bold(`${typeActionTitle}`)} ] ${colors.red(`${typeActionDescribe}`)} - [ ${colors.bold(`${messageTitle}`)} ] ${colors.red(`${messageContent}`)} - [ ${colors.red(`${colors.bold(`HttpCode`)}`)} ] ${colors.red(`${colors.bold(`${httpCodeValue}`)}`)} `);
}