import gradient from "gradient-string";
import process from "node:process";

export function serverExecutionTimeUtils(host: any, env: any, port: number) {
    const hrStart = process.hrtime();
    const hrEnd = process.hrtime(hrStart);
    return console.log(gradient(`cyan`, `pink`, `orange`)(`╭─────────────────────────────────────────────────╮\n` +
        `│                                                      │\n` +
        `│                    ENV: ${env}                       │\n` +
        `│       ${host} listening on the port ${port}          │\n` +
        `│                                                      │\n` +
        `│       server execution time ${hrEnd[1]/1000}s        │\n` +
        `│                                                      │\n` +
        `╰──────────────────────────────────────────────────────╯\n`));
}