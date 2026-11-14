// Security regression tests, run against the BUILT package (dist/) like a consumer would.
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import net from "node:net";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const distEntry = path.resolve(here, "../dist/index.mjs");
const core = await import(distEntry);
const {
    HashPasswordUtils,
    ValidatePasswordUtils,
    Exception,
    YamlParsing,
    express,
    jsonBodyParserType,
    urlencodedBodyParserType,
} = core;

/** Silences console.error while running fn and returns what was logged. */
async function captureErrors(fn) {
    const original = console.error;
    const logged = [];
    console.error = (...args) => { logged.push(args.map(String).join(" ")); };
    try {
        await fn();
    } finally {
        console.error = original;
    }
    return logged.join("\n");
}

async function withServer(app, fn) {
    const server = app.listen(0, "127.0.0.1");
    await new Promise((resolve) => server.once("listening", resolve));
    const { port } = server.address();
    try {
        await fn(`http://127.0.0.1:${port}`);
    } finally {
        await new Promise((resolve) => server.close(resolve));
    }
}

/* ------------------------------------------------------------------ passwords */

test("password hashing uses a strong PBKDF2 iteration count and round-trips", () => {
    const { salt, hash, iterations } = HashPasswordUtils.password("correct horse battery staple");
    assert.ok(iterations >= 210_000, "iteration count must follow OWASP guidance");
    assert.match(salt, /^[0-9a-f]{64}$/);
    assert.match(hash, /^[0-9a-f]{128}$/);
    assert.equal(ValidatePasswordUtils.verifyHash("correct horse battery staple", hash, salt, iterations), true);
    assert.equal(ValidatePasswordUtils.verifyHash("correct horse battery staple", hash, salt), true);
    assert.equal(ValidatePasswordUtils.verifyHash("wrong password", hash, salt), false);
});

test("password hashing refuses empty passwords and weak iteration counts", async () => {
    await captureErrors(() => {
        assert.throws(() => HashPasswordUtils.password(""));
        assert.throws(() => HashPasswordUtils.password("secret", 1));
    });
});

test("verifyHash fails closed when the stored hash/salt is missing (no undefined === undefined bypass)", async () => {
    await captureErrors(() => {
        assert.equal(ValidatePasswordUtils.verifyHash("anything", undefined, undefined), false);
        assert.equal(ValidatePasswordUtils.verifyHash("anything", undefined, null), false);
        assert.equal(ValidatePasswordUtils.verifyHash("anything", null, {}), false);
        assert.equal(ValidatePasswordUtils.verifyHash(undefined, undefined, undefined), false);
    });
});

test("verifyHash rejects malformed hashes without throwing", async () => {
    const { salt, hash } = HashPasswordUtils.password("pw", HashPasswordUtils.LEGACY_ITERATIONS);
    await captureErrors(() => {
        assert.equal(ValidatePasswordUtils.verifyHash("pw", "zz" + hash.slice(2), salt), false);
        assert.equal(ValidatePasswordUtils.verifyHash("pw", hash.slice(0, 64), salt), false);
        assert.equal(ValidatePasswordUtils.verifyHash("pw", hash + "00", salt), false);
        assert.equal(ValidatePasswordUtils.verifyHash("pw", Buffer.from(hash, "hex"), salt), false);
        assert.equal(ValidatePasswordUtils.verifyHash("pw", { toString: () => hash }, salt), false);
        assert.equal(ValidatePasswordUtils.verifyHash("pw", hash, salt, -5), false);
    });
});

test("verifyHash still accepts legacy 10 000-iteration hashes", () => {
    const salt = crypto.randomBytes(32).toString("hex");
    const legacy = crypto.pbkdf2Sync("legacy-pw", salt, 10_000, 64, "sha512").toString("hex");
    assert.equal(ValidatePasswordUtils.verifyHash("legacy-pw", legacy, salt), true);
    assert.equal(ValidatePasswordUtils.verifyHash("legacy-pw!", legacy, salt), false);
});

test("verifyHash compares digests with crypto.timingSafeEqual", () => {
    const { salt, hash } = HashPasswordUtils.password("timing", HashPasswordUtils.LEGACY_ITERATIONS);
    const original = crypto.timingSafeEqual;
    let calls = 0;
    crypto.timingSafeEqual = (a, b) => { calls++; return original(a, b); };
    try {
        assert.equal(ValidatePasswordUtils.verifyHash("timing", hash, salt, HashPasswordUtils.LEGACY_ITERATIONS), true);
        assert.equal(ValidatePasswordUtils.verifyHash("timinG", hash, salt, HashPasswordUtils.LEGACY_ITERATIONS), false);
    } finally {
        crypto.timingSafeEqual = original;
    }
    assert.equal(calls, 2, "every comparison must go through timingSafeEqual");
});

/* ------------------------------------------------------------------ secrets in logs */

test("the database access-denied message never contains the password", () => {
    const message = Exception.accessDeniedToDBCon("root", "S3cr3t-P@ss");
    assert.ok(!message.includes("S3cr3t-P@ss"), message);
    assert.ok(message.includes("root"));
});

/* ------------------------------------------------------------------ YAML parsing */

test("YAML parsing cannot pollute Object.prototype and returns the parsed object", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "opticore-core-yaml-"));
    const file = path.join(dir, "config.yaml");
    fs.writeFileSync(file, [
        "__proto__: x",
        "  polluted: yes",
        "constructor:",
        "  prototype: hacked",
        "prototype:",
        "  evil: 1",
        "app:",
        "  name: demo",
        "port: 3000",
    ].join("\n"));
    try {
        const result = await new YamlParsing().readFile(file);
        assert.equal({}.polluted, undefined);
        assert.equal(Object.prototype.polluted, undefined);
        assert.equal(Object.prototype.evil, undefined);
        assert.equal(typeof Object.prototype.constructor, "function");
        assert.equal(Object.hasOwn(result, "__proto__"), false);
        assert.equal(Object.hasOwn(result, "constructor"), false);
        assert.deepEqual(result.app, { name: "demo" });
        assert.equal(result.port, "3000");
        assert.equal(Object.getPrototypeOf(result), Object.prototype);
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});

test("YAML parsing errors do not dump the file content (secrets) to the logs", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "opticore-core-yaml-"));
    const file = path.join(dir, "secrets.yaml");
    fs.writeFileSync(file, "db_password: TopSecretValue42\n- an unsupported line\n");
    try {
        const logged = await captureErrors(() => new YamlParsing().readFile(file));
        assert.ok(logged.length > 0, "the unsupported line is reported");
        assert.ok(!logged.includes("TopSecretValue42"), logged);
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});

/* ------------------------------------------------------------------ body parsers */

test("body parser factories return a usable middleware", () => {
    assert.equal(typeof jsonBodyParserType({ type: "application/json" }), "function");
    assert.equal(typeof urlencodedBodyParserType({ type: "application/x-www-form-urlencoded" }), "function");
});

test("json body parser enforces a size limit (413) and still parses normal bodies", async () => {
    const app = express();
    app.use(jsonBodyParserType({ type: "application/vnd.test+json", limit: 1024 }));
    app.post("/", (req, res) => res.json({ body: req.body }));
    await withServer(app, async (base) => {
        const ok = await fetch(base, {
            method: "POST",
            headers: { "content-type": "application/vnd.test+json" },
            body: JSON.stringify({ a: 1 }),
        });
        assert.equal(ok.status, 200);
        assert.deepEqual((await ok.json()).body, { a: 1 });

        const big = await fetch(base, {
            method: "POST",
            headers: { "content-type": "application/vnd.test+json" },
            body: JSON.stringify({ a: "x".repeat(10_000) }),
        });
        assert.equal(big.status, 413);
    });
});

test("json body parser rejects oversized chunked bodies without Content-Length", async () => {
    const app = express();
    app.use(jsonBodyParserType({ type: "application/vnd.test+json", limit: 1024 }));
    app.post("/", (req, res) => res.json({ size: JSON.stringify(req.body).length }));
    await withServer(app, async (base) => {
        const chunks = new ReadableStream({
            start(controller) {
                for (let i = 0; i < 20; i++) controller.enqueue(new TextEncoder().encode("x".repeat(512)));
                controller.close();
            },
        });
        const res = await fetch(base, {
            method: "POST",
            headers: { "content-type": "application/vnd.test+json" },
            body: chunks,
            duplex: "half",
        });
        assert.equal(res.status, 413);
    });
});

test("urlencoded body parser drops prototype-polluting keys", async () => {
    const app = express();
    app.use(urlencodedBodyParserType({ type: "application/x-www-form-urlencoded" }));
    app.post("/", (req, res) => res.json({
        keys: Object.keys(req.body),
        ownProto: Object.hasOwn(req.body, "__proto__"),
        protoIsObject: Object.getPrototypeOf(req.body) === Object.prototype,
        name: req.body.name,
    }));
    await withServer(app, async (base) => {
        const res = await fetch(base, {
            method: "POST",
            headers: { "content-type": "application/x-www-form-urlencoded" },
            body: "__proto__=evil&constructor=evil&prototype=evil&%5F%5Fproto%5F%5F=evil&name=bob",
        });
        assert.equal(res.status, 200);
        const json = await res.json();
        assert.deepEqual(json.keys, ["name"]);
        assert.equal(json.ownProto, false);
        assert.equal(json.protoIsObject, true);
        assert.equal(json.name, "bob");
        assert.equal({}.evil, undefined);
    });
});

/* ------------------------------------------------------------------ CoreApplication HTTP hardening */

async function freePort() {
    const srv = net.createServer();
    await new Promise((resolve) => srv.listen(0, "127.0.0.1", resolve));
    const { port } = srv.address();
    await new Promise((resolve) => srv.close(resolve));
    return port;
}

test("CoreApplication hides stack traces and x-powered-by (NODE_ENV unset)", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "opticore-core-app-"));
    const port = await freePort();
    fs.writeFileSync(path.join(dir, ".env"), `APP_HOST=127.0.0.1\nAPP_PORT=${port}\n`);
    const script = `
        const core = await import(${JSON.stringify(distEntry)});
        const { CoreApplication, express } = core;
        const router = express.Router();
        router.get("/", () => { throw new Error("internal detail: db password=hunter2"); });
        const app = new CoreApplication(express());
        const server = app.onStartServer([{ featureRoute: [{ path: "/boom", handler: router }] }]);
        server.once("listening", async () => {
            await new Promise((r) => setTimeout(r, 50));
            const res = await fetch("http://127.0.0.1:${port}/boom");
            const body = await res.text();
            process.stdout.write("RESULT" + JSON.stringify({
                status: res.status,
                poweredBy: res.headers.get("x-powered-by"),
                body
            }) + "\\n");
            process.exit(0);
        });
    `;
    const env = { ...process.env };
    delete env.NODE_ENV;
    try {
        const output = await new Promise((resolve, reject) => {
            const child = spawn(process.execPath, ["--input-type=module", "-e", script], { cwd: dir, env });
            let out = "";
            child.stdout.on("data", (d) => { out += d; });
            child.stderr.on("data", () => {});
            const timer = setTimeout(() => { child.kill(); reject(new Error("timeout:\n" + out)); }, 20_000);
            child.on("exit", () => { clearTimeout(timer); resolve(out); });
        });
        const line = output.split("\n").find((l) => l.startsWith("RESULT"));
        assert.ok(line, "child produced a result:\n" + output);
        const result = JSON.parse(line.slice("RESULT".length));
        assert.equal(result.status, 500);
        assert.equal(result.poweredBy, null);
        assert.ok(!result.body.includes("hunter2"), result.body);
        assert.ok(!/at .*\(.*:\d+:\d+\)/.test(result.body), "no stack trace in the response");
        assert.deepEqual(JSON.parse(result.body), { errorMessage: "Internal Server Error", responseStatus: 500 });
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});
