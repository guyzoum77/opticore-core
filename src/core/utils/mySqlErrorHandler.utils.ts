import {colors, Exception, ExceptionHandlerError, HttpStatusCodesConstant, LoggerComponent, mySQL} from "../../index";
import chalk from "chalk";

export function mySqlErrorHandlerUtils(err: mySQL.MysqlError, dbHost?: string | null,
                                       database?: string | null, user?: string | null,
                                       password?: string | null): void {
    const dateTime: string = `${(new Date().getMonth())}-${(new Date().getDate())}-${(new Date().getFullYear())} ${(new Date().getHours())}:${(new Date().getMinutes())}:${(new Date().getSeconds())}`;
    switch (err.code) {
        case "EAI_AGAIN":
            LoggerComponent.logErrorMessage(Exception.errorDBHost(dbHost!), Exception.mysqlErrorCon);
            logErrorName();
            console.log(`[ ${colors.red(`${colors.bold('DataBase connection')}`)} ] | ${dateTime} | [ ${colors.red(`${colors.bold(`error`)}`)} ] | [ ${colors.bold(`Type error`)} ] ${colors.red(`${Exception.mysqlErrorCon} : ${colors.bold(`EAI_AGAIN`)}`)} - [ ${colors.bold(`Error message`)} ] ${colors.red(`${Exception.errorDBHost(dbHost!)}`)} - [ ${colors.red(`${colors.bold(`HttpCode`)}`)} ] ${HttpStatusCodesConstant.UNAUTHORIZED}`);
            break;
        case "ER_NOT_SUPPORTED_AUTH_MODE":
            LoggerComponent.logErrorMessage(Exception.erNotSupportedAuthMode, Exception.mysqlErrorCon);
            logErrorName();
            console.log(`[ ${colors.red(`${colors.bold('DataBase connection')}`)} ] | ${dateTime} | [ ${colors.red(`${colors.bold(`error`)}`)} ] | [ ${colors.bold(`Type error`)} ] ${colors.red(`${Exception.mysqlErrorCon} : ${colors.bold(`ER_NOT_SUPPORTED_AUTH_MODE`)}`)} - [ ${colors.bold(`Error message`)} ] ${colors.red(`${Exception.erNotSupportedAuthMode}`)} - [ ${colors.red(`${colors.bold(`HttpCode`)}`)} ] ${HttpStatusCodesConstant.UNAUTHORIZED} `)
            break;
        case "ER_ACCESS_DENIED_ERROR":
            LoggerComponent.logErrorMessage(Exception.accessDeniedToDBCon(user!, password!), Exception.mysqlErrorCon);
            logErrorName();
            console.log(`[ ${colors.red(`${colors.bold('DataBase connection')}`)} ] | ${dateTime} | [ ${colors.red(`${colors.bold(`error`)}`)} ] | [ ${colors.bold(`Type error`)} ] ${colors.red(`${Exception.mysqlErrorCon} : ${colors.bold(`ER_ACCESS_DENIED_ERROR`)}`)} - [ ${colors.bold(`Error message`)} ] ${colors.red(`${Exception.accessDeniedToDBCon(user!, password!)}`)} - [ ${colors.red(`${colors.bold(`HttpCode`)}`)} ] ${HttpStatusCodesConstant.UNAUTHORIZED} `)
            break;
        case "ER_BAD_DB_ERROR":
            LoggerComponent.logErrorMessage(Exception.unknownDB(database!), Exception.mysqlErrorCon);
            logErrorName();
            console.log(`[ ${colors.red(`${colors.bold('DataBase connection')}`)} ] | ${dateTime} | [ ${colors.red(`${colors.bold(`error`)}`)} ] | [ ${colors.bold(`Type error`)} ] ${colors.red(`${Exception.mysqlErrorCon} : ${colors.bold(`ER_BAD_DB_ERROR`)}`)} - [ ${colors.bold(`Error message`)} ] ${colors.red(`${Exception.unknownDB(database!)}`)} - [ ${colors.red(`${colors.bold(`HttpCode`)}`)} ] ${HttpStatusCodesConstant.NOT_FOUND} `);
            break;
        default:
            LoggerComponent.logErrorMessage(err.message, Exception.mySQLError);
            console.log(`[ ${colors.red(`${colors.bold('DataBase connection')}`)} ] | ${dateTime} | [ ${colors.red(`${colors.bold(`error`)}`)} ] | [ ${colors.bold(`Type error`)} ] ${colors.red(`${Exception.mysqlErrorCon} : ${colors.bold(`MysqlError`)}`)} - [ ${colors.bold(`Error message`)} ] ${colors.red(`${err.message}`)} - [ ${colors.red(`${colors.bold(`HttpCode`)}`)} ] ${HttpStatusCodesConstant.GONE} `);
    }
}

function logErrorName() {
    console.log(chalk.bgRed.white(''.padEnd(18, ' ')));
    let msg: string = colors.bold(' Errors occurring ');
    console.log(chalk.bgRed.white(msg.padEnd(17.6, ' ')));
    console.log(chalk.bgRed.white(''.padEnd(18.5, ' ')));
}