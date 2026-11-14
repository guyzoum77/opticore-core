import crypto from "node:crypto";

const NUMERIC: string = "0123456789";
const ALPHA_LOWER: string = "abcdefghijklmnopqrstuvwxyz";
const ALPHA_UPPER: string = ALPHA_LOWER.toUpperCase();
// Sortable order, as in rand-token.
const ALPHA_NUMERIC: string = NUMERIC + ALPHA_UPPER + ALPHA_LOWER;
const DEFAULT_EPOCH: number = 946684800000;
const DEFAULT_PREFIX_LENGTH: number = 8;

export type RandTokenSource = "default" | "crypto" | "math" | ((size: number) => Buffer);

export interface RandTokenGeneratorOptions {
    chars?: "default" | "a-z" | "alpha" | "A-Z" | "ALPHA" | "0-9" | "numeric" | "base32" | string;
    source?: RandTokenSource;
}

export interface RandTokenGenerator {
    generate(size: number, chars?: string): string;
}

/**
 * Resolves the character set names accepted by rand-token ("alpha", "numeric", "base32"...) and validates the result.
 */
function resolveChars(chars: string | undefined): string {
    let resolved: string;
    switch (chars ?? "default") {
        case "default":
            resolved = ALPHA_NUMERIC;
            break;
        case "a-z":
        case "alpha":
            resolved = ALPHA_LOWER;
            break;
        case "A-Z":
        case "ALPHA":
            resolved = ALPHA_UPPER;
            break;
        case "0-9":
        case "numeric":
            resolved = NUMERIC;
            break;
        case "base32":
            resolved = ALPHA_UPPER + "234567";
            break;
        default:
            resolved = chars as string;
    }
    if (typeof resolved !== "string" || resolved.length === 0 || resolved.length >= 256) {
        throw new TypeError("randToken: the character set must be a non-empty string of fewer than 256 characters");
    }
    return resolved;
}

/**
 * Picks the random byte source. "default", "crypto" and "math" all use crypto.randomBytes: rand-token's default
 * relied on the deprecated crypto.pseudoRandomBytes and "math" on Math.random, neither fit for tokens.
 * A custom function is still honoured (the caller owns its quality).
 */
function resolveSource(source: RandTokenSource | undefined): (size: number) => Buffer {
    if (typeof source === "function") {
        return source;
    }
    return (size: number): Buffer => crypto.randomBytes(size);
}

/**
 * Builds a token generator with the same signature as rand-token's `generator(options)`.
 * Characters are drawn from cryptographically secure random bytes with rejection sampling (no modulo bias).
 */
function generator(options: RandTokenGeneratorOptions = {}): RandTokenGenerator {
    if (options === null || typeof options !== "object") {
        throw new TypeError("randToken.generator: options must be an object");
    }
    const defaultChars: string = resolveChars(options.chars);
    const source: (size: number) => Buffer = resolveSource(options.source);

    return {
        generate(size: number, chars?: string): string {
            if (!Number.isSafeInteger(size) || size < 0) {
                throw new RangeError("randToken.generate: size must be a non-negative integer");
            }
            const alphabet: string = chars ? resolveChars(chars) : defaultChars;
            const max: number = Math.floor(256 / alphabet.length) * alphabet.length;
            let token: string = "";
            while (token.length < size) {
                const bytes: Buffer = source(size - token.length);
                for (let i = 0; i < bytes.length && token.length < size; i++) {
                    const byte: number = bytes.readUInt8(i);
                    if (byte < max) {
                        token += alphabet[byte % alphabet.length];
                    }
                }
            }
            return token;
        }
    };
}

/**
 * Base62 encoding of a non-negative number (suid prefix).
 */
function base62(value: number): string {
    let n: number = Math.floor(value);
    const digits: string[] = [];
    do {
        digits.push(ALPHA_NUMERIC[n % 62]);
        n = Math.floor(n / 62);
    } while (n > 0);
    return digits.reverse().join("");
}

const defaultGenerator: RandTokenGenerator = generator();

// Drop-in replacement for the unmaintained `rand-token` package (same `generate`, `uid`, `suid` and `generator`
// functions), backed by node:crypto's CSPRNG.
export const randTokenUtils = {
    generator,
    generate: (size: number, chars?: string): string => defaultGenerator.generate(size, chars),
    uid: (size: number, chars?: string): string => defaultGenerator.generate(size, chars),
    suid: (length: number, epoch?: number, prefixLength?: number): string => {
        let prefix: string = base62(Date.now() - (epoch || DEFAULT_EPOCH));
        const width: number = prefixLength || DEFAULT_PREFIX_LENGTH;
        while (prefix.length < width) {
            prefix = "0" + prefix;
        }
        return prefix + defaultGenerator.generate(length);
    }
};
