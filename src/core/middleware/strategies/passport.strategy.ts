import {JwtPayload} from "jsonwebtoken";
import {passportUseGuard} from "@/core/middleware/guard/passportGuard.middleware";
import {JwtStr} from "@/index";
import {ExtractJwt, StrategyOptionsWithoutRequest, VerifiedCallback} from "passport-jwt";

/**
 * Asymmetric algorithms accepted for tokens verified with a public key.
 * Pinning them prevents algorithm confusion (`none`, or HS* tokens signed with the public key as HMAC secret).
 */
export const PUBLIC_KEY_JWT_ALGORITHMS = ["RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512"] as const;

export abstract class PassportStrategy {
    private readonly pubKey: string;

    protected constructor(publicKey: string) {
        this.pubKey = publicKey;
    }

    jwtValidate(payload: JwtPayload, done: VerifiedCallback): void {}
    get useJWT() {
        const options: StrategyOptionsWithoutRequest = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: this.pubKey,
            algorithms: [...PUBLIC_KEY_JWT_ALGORITHMS],
        };
        return passportUseGuard(
            "jwt",
            JwtStr as any,
            options,
            this.jwtValidate
        );
    }

    async localValidate() {}
    get useLocal(): void {
        return undefined;
    }
}
