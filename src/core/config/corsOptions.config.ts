
/**
 * This class allow to authorise define http method
 */
export default class CorsOptionsConfig {
    static options () {
        return {
            credentials: true,
            methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
            origin: (origin: any, callback: (arg0: null, arg1: boolean) => void): void => {
                callback (null, true)
            }
        }
    }
}
