import process from "node:process";
import {styleText} from "node:util";
import {UtilityUtils} from "./utility.utils";

export function serverExecutionTimeUtils(host: any, env: any, port: number): void {
    const utility: UtilityUtils = new UtilityUtils();
    const hrStart: [number, number] = process.hrtime();
    const hrEnd: [number, number] = process.hrtime(hrStart);
    const okServer: string = "[Ok] Server is starting";
    const ndVrs: string = `The Web server is using Node ${utility.getVersions()}`;
    const url: string = `http://${host}:${port}`;
    const startingTime: string = `Ready in: ${hrEnd[1]/1000}s`;
    console.log(styleText('bgGreen', `\n\n ${okServer}\n       ${ndVrs}       ${url}\n       ${startingTime}\n`));
}