import express from "express";
import {PassportStrategy} from "@/core/middleware/strategies/passport.strategy";
import {JwtPayload} from "jsonwebtoken";

export class RoutersAppCore {
    static route(items: { path: string; handler: express.Router }[]) {
        return items;
    }
}

export class ggr implements PassportStrategy {
    private readonly pubKey: string;

    jwtValidate(payload: JwtPayload, done: any): void {
    }

    async localValidate(): Promise<void> {
        return Promise.resolve(undefined);
    }

    get useJWT(): void {
    }

    get useLocal(): void {
    }
}