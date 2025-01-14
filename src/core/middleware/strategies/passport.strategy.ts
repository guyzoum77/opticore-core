import {JwtPayload} from "jsonwebtoken";
import {passportUseGuard} from "@/core/middleware/guard/passportGuard.middleware";
import {JwtStr} from "@/index";
import {ExtractJwt} from "passport-jwt";

export abstract class PassportStrategy {
    private readonly pubKey: string;

    protected constructor(publicKey: string) {
        this.pubKey = publicKey;
    }

    jwtValidate(payload: JwtPayload, done: any) {}
    get useJWT() {
        return passportUseGuard(
            "jwt",
            JwtStr,
            { jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: this.pubKey },
            this.jwtValidate
        );
    }

    async localValidate() {}
    get useLocal() {}
}