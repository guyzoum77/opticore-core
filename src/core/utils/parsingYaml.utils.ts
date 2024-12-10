import { readFile } from 'fs/promises';
import {LogMessageUtils} from "@/core/utils/logMessage.utils";
import {HttpStatusCodesConstant} from "@/domain/constants/httpStatusCodes.constant";

export class YamlParsing {
    private async parsing(content: string): Promise<Record<string, any>> {
        const result: Record<string, any> = {};
        const lines: string[] = content.split('\n');
        let currentKey: string | null = null;

        for (const line of lines) {
            // Ignore empty lines or comments
            if (!line.trim() || line.trim().startsWith('#')) {
                continue;
            }

            const keyValueMatch: RegExpMatchArray | null = line.match(/^(\s*)([a-zA-Z0-9_]+):(?:\s*(.*))?$/);
            if (keyValueMatch) {
                const [, indent, key, value] = keyValueMatch;
                // Handle nested objects (simple one-level nesting)
                if (indent.length > 0 && currentKey) {
                    result[currentKey] = result[currentKey] || {};
                    result[currentKey][key] = value?.trim() || null;
                } else {
                    currentKey = key;
                    result[key] = value?.trim() || null;
                }

            } else {
                LogMessageUtils.error(
                    "YAML Parsing failed",
                    "Unsupported YAML format",
                    content,
                    `Unsupported YAML line format: ${line}`,
                    HttpStatusCodesConstant.NOT_ACCEPTABLE
                );
            }
        }

        return result;
    }

    public async readFile(filePath: string): Promise<void> {
        try {
            const yamlContent: string = await readFile(filePath, 'utf-8');
            await this.parsing(yamlContent);
        } catch (error) {
            LogMessageUtils.error(
                "YAML Parsing failed",
                "Error reading YAML file",
                error.stack,
                error.message,
                HttpStatusCodesConstant.NOT_ACCEPTABLE
            );
        }
    }
}