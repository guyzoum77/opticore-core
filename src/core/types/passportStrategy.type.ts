export type TPassportStrategy<T, U, X> = { new (params: U, callback: X): T}