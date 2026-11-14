import { readFile } from 'fs/promises';
import {LogMessageUtils} from "@/core/utils/logMessage.utils";
import {HttpStatusCodesConstant} from "@/domain/constants/httpStatusCodes.constant";

/**
 * Minimal YAML reader (top-level keys and one level of nesting).
 *
 * Keys that could pollute object prototypes (`__proto__`, `constructor`, `prototype`)
 * are ignored, and the file content is never written to the logs (it may hold secrets).
 */
export class YamlParsing {
    private static readonly FORBIDDEN_KEYS: ReadonlySet<string> = new Set(["__proto__", "constructor", "prototype"]);
    private static readonly MAX_FILE_SIZE: number = 1024 * 1024;

    private async parsing(content: string): Promise<Record<string, any>> {
        const result: Record<string, any> = {};
        const lines: string[] = content.split('\n');
        let currentKey: string | null = null;
        let skipNested: boolean = false;

        for (let index: number = 0; index < lines.length; index++) {
            const line: string = lines[index].replace(/\r$/, "");
            // Ignore empty lines or comments
            if (!line.trim() || line.trim().startsWith('#')) {
                continue;
            }

            const keyValueMatch: RegExpMatchArray | null = line.match(/^(\s*)([a-zA-Z0-9_]+):(?:\s*(.*))?$/);
            if (keyValueMatch) {
                const [, indent, key, value] = keyValueMatch;
                if (indent.length === 0) {
                    skipNested = false;
                }
                if (YamlParsing.FORBIDDEN_KEYS.has(key)) {
                    if (indent.length === 0) {
                        currentKey = null;
                        skipNested = true;
                    }
                    continue;
                }
                if (skipNested) {
                    continue;
                }
                // Handle nested objects (simple one-level nesting)
                if (indent.length > 0 && currentKey) {
                    const parent: any = Object.hasOwn(result, currentKey) ? result[currentKey] : null;
                    if (parent === null || typeof parent !== "object") {
                        result[currentKey] = {};
                    }
                    result[currentKey][key] = value?.trim() || null;
                } else {
                    currentKey = key;
                    result[key] = value?.trim() || null;
                }

            } else {
                LogMessageUtils.error(
                    "YAML Parsing failed",
                    "Unsupported YAML format",
                    `line ${index + 1}`,
                    `Unsupported YAML line format at line ${index + 1}`,
                    HttpStatusCodesConstant.NOT_ACCEPTABLE
                );
            }
        }

        return result;
    }

    /**
     * Reads and parses a YAML file.
     *
     * @param filePath path of the file to read
     * @returns the parsed object (an empty object when the file cannot be read or parsed)
     */
    public async readFile(filePath: string): Promise<Record<string, any>> {
        try {
            const yamlContent: string = await readFile(filePath, 'utf-8');
            if (yamlContent.length > YamlParsing.MAX_FILE_SIZE) {
                throw new RangeError(`YAML file is larger than ${YamlParsing.MAX_FILE_SIZE} characters`);
            }
            return await this.parsing(yamlContent);
        } catch (error: any) {
            LogMessageUtils.error(
                "YAML Parsing failed",
                "Error reading YAML file",
                error.stack,
                error.message,
                HttpStatusCodesConstant.NOT_ACCEPTABLE
            );
            return {};
        }
    }
}
