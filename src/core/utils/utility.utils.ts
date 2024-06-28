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
            "Memory usage system": process.cpuUsage().system,
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
        return {
            "projectPath": process.cwd()
        }
    }

}