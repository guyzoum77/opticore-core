const FORBIDDEN_KEYS: ReadonlySet<string> = new Set(["__proto__", "constructor", "prototype"]);

/**
 *
 * @param rawBody
 *
 * URL-encoded body parse function.
 * Keys that could pollute object prototypes (`__proto__`, `constructor`, `prototype`) are dropped.
 */
export function parseUrlencodedUtils(rawBody: string): any {
    const pairs: string[] = rawBody.split('&');
    const result: { [key: string]: string } = {};
    for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key && value) {
            const decodedKey: string = decodeURIComponent(key);
            if (FORBIDDEN_KEYS.has(decodedKey)) {
                continue;
            }
            result[decodedKey] = decodeURIComponent(value);
        }
    }
    return result;
}
