import {colors, fs, path} from "../../index";
import process from "node:process";

export class UtilityUtils {
    private formatMemoryUsage(data: any): string {
        return `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;
    }
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

    public getProjectInfo() {
        const startTime = process.hrtime();
        const endTime = process.hrtime(startTime);
        const executionTime = (endTime[0] * 1e9 + endTime[1]) / 1e6; // Convertir en millisecondes
        return {
            "projectPath": path.join(process.cwd()),
            "startingTime": `${executionTime.toFixed(5)} ms`
        }
    }
    private getEnvFileLoading(filePath: string): void {
        const fullPath: string = path.resolve(process.cwd(), filePath);
        if (fs.existsSync(fullPath)) {
            const env: string = fs.readFileSync(fullPath, 'utf-8');
            const lines: string[] = env.split('\n');

            lines.forEach((line: string): void => {
                const match: RegExpMatchArray | null = line.match(/^([^#=]+)=([^#]+)$/);
                if (match) {
                    const key: string = match[1].trim();
                    process.env[key] = match[2].trim();
                }
            });
        }
    }

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
}