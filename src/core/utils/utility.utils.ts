import {colors, fs, path} from "../../index";
import process from "node:process";
import chalk from 'chalk';


export class UtilityUtils {

    /**
     *
     * @param data
     * @private
     * Return a string converted in MegaBytes
     */
    private formatMemoryUsage(data: any): string {
        return `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;
    }

    /**
     * Returns an Object containing a node version, openssl, and v0
     */
    public getVersions() {
        const processVers: NodeJS.ProcessVersions = process.versions;
        const data = {
            "node version" : processVers.node,
            "openssl": processVers.openssl,
            "v8": processVers.v8
        };

        return {
          "nodeVersion" : data["node version"],
          "openssl": data.openssl,
          "v8": data.v8
        };
    }

    /**
     * Return an Object containing a Resident Set Size - total memory allocated for the process execution
     * Total size of the allocated heap
     * Actual memory used during the execution
     * Memory usage user
     * and Memory usage system
     */
    public getUsageMemory() {
        const memoryData: NodeJS.MemoryUsage = process.memoryUsage();
        const data = {
            "Resident Set Size - total memory allocated for the process execution": this.formatMemoryUsage(memoryData.rss),
            "Total size of the allocated heap": this.formatMemoryUsage(memoryData.heapTotal),
            "Actual memory used during the execution": this.formatMemoryUsage(memoryData.heapUsed),
            "V8 external memory": this.formatMemoryUsage(memoryData.external),
            "Memory usage user": this.formatMemoryUsage(process.cpuUsage().user),
            "Memory usage system": this.formatMemoryUsage(process.cpuUsage().system),
        }

        return {
            "rss": data["Resident Set Size - total memory allocated for the process execution"],
            "heapTotal": data["Total size of the allocated heap"],
            "heapUsed": data["Actual memory used during the execution"],
            "external": data["V8 external memory"],
            "user": data["Memory usage user"],
            "system": data["Memory usage system"]
        }
    }

    /**
     * Return an Object containing a project path and running server time
     */
    public getProjectInfo() {
        const startTime:[number, number] = process.hrtime();
        const endTime:[number, number] = process.hrtime(startTime);
        const executionTime: number = (endTime[0] * 1e9 + endTime[1]) / 1e6; // Convertir en millisecondes
        return {
            "projectPath": path.join(process.cwd()),
            "startingTime": `${executionTime.toFixed(5)} ms`
        }
    }

    /**
     *
     * @param filePath
     * @private
     */
    private getEnvFileLoading(filePath: string): void {
        const fullPath: string = path.resolve(process.cwd(), filePath);
        if (fs.existsSync(fullPath)) {
            const env: string = fs.readFileSync(fullPath, 'utf-8');
            const lines: string[] = env.split('\n');

            lines.forEach((line: string): void => {
                const match: RegExpMatchArray | null = line.match(/^([^#=]+)=([^#]+)$/);
                if (match) {
                    const key: string = match[1].trim();
                    process.env[key]  = match[2].trim();
                }
            });
        }
    }

    /**
     *
     * @param development
     * @param production
     */
    public getServerRunningMode(development: string, production: string, ): string {
        /**
         *  Load environment variables from the .env file
         */
        this.getEnvFileLoading('.env');

        const isDevelopment: boolean = process.env.NODE_ENV === 'development';
        if (isDevelopment) {
            return `The server is running in ${colors.bgBlue(`${colors.bold(`${development}`)}`)} mode`;
        } else {
            return `The server is running in ${colors.bgBlue(`${colors.bold(`${production}`)}`)} mode`;
        }
    }

    public infoServer(nodeVersion: string, startingTime: any, host: string, port: number, rss: string, heapUsed: string, user: string, system: string): void {
        // Padding length
        const paddingLength = 52;

        // Creating padded messages
        const msg0: string = ' '.padEnd(paddingLength, ' ');
        const msg1: string = ' [OK] Web server listening';
        const msg2Value: string = `${colors.bgBlue(`${colors.bold(`${nodeVersion}`)}`)}`;
        const msg2: string = ` The Web server is using Node.js version`;
        const msg3Value: string = `${colors.bgBlue(`${colors.bold(`${startingTime}`)}`)}`;
        const msg3: string = ` Startup time:`;
        const msg4: string = ` ${this.getServerRunningMode('development', 'production')}`;
        const msg5: string = ` ${colors.underline(`http://${host}:${port}`)}`;

        // display the message
        console.log(chalk.bgGreen.white(msg0.padEnd(paddingLength, ' ')));
        console.log(chalk.bgGreen.white(msg1.padEnd(paddingLength, ' ')));
        console.log(chalk.bgGreen.white(msg2, msg2Value.padEnd(30.5, ' ')));
        console.log(chalk.bgGreen.white(msg3, msg3Value.padEnd(56, ' ')));
        console.log(chalk.bgGreen.white(msg4.padEnd(71, ' ')));
        console.log(chalk.bgGreen.white(msg5.padEnd(61, ' ')));
        console.log(chalk.bgGreen.white(msg0.padEnd(paddingLength, ' ')));
        console.log(``);
        console.log(`${(`Resident Set Size - total memory allocated for the process execution :`)} ${colors.cyan(`${colors.bold(`${rss}`)}`)}`);
        console.log(`${(`Actual memory used during the execution :`)} ${colors.cyan(`${colors.bold(`${heapUsed}`)}`)}`);
        console.log(`${(`Memory usage by user :`)} ${colors.cyan(`${colors.bold(`${user}`)}`)}`);
        console.log(`${(`Memory usage by system :`)} ${colors.cyan(`${colors.bold(`${system}`)}`)}`);
        console.log(``);
    }
}