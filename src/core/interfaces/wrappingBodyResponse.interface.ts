export interface WrappingBodyResponseInterface {
    (chunk: any, callback?: (error: (Error | null | undefined)) => void): boolean;
    (chunk: any, encoding: BufferEncoding, callback?: (error: (Error | null | undefined)) => void): boolean;
}