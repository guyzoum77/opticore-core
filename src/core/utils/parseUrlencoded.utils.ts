/**
 *
 * @param rawBody
 *
 * URL-encoded body parse function
 */
export function parseUrlencodedUtils(rawBody: string): any {
    const pairs: string[] = rawBody.split('&');
    const result: { [key: string]: string } = {};
    for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key && value) {
            result[decodeURIComponent(key)] = decodeURIComponent(value);
        }
    }
    return result;
}