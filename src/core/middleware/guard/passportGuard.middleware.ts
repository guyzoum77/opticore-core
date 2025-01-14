import passport, { Strategy } from "passport";
import { TPassportStrategy } from "@/core/types/passportStrategy.type";

export function passportUseGuard<T extends Strategy, U, X>(name: string,
                                                           Strategy: TPassportStrategy<T, U, X>,
                                                           params: U,
                                                           callback: X) {
    passport.use(name, new Strategy(params, callback));
}