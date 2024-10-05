export class EnvironmentUtils<T> {
    private readonly config: T;

    constructor(config: T) {
        this.config = config;
    }

    get<K extends keyof T>(key: K): T[K] {
        return this.config[key];
    }
}