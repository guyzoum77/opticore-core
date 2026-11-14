export interface BodyParserOptionsInterface {
    type: string;
    /**
     * Maximum accepted body size in bytes (default: 100 KiB, like express.json()).
     * Larger bodies are rejected with HTTP 413 before being buffered further.
     */
    limit?: number;
}
