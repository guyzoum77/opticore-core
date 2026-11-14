// Node 26 / dependency majors (express 5, mysql2, crypto tokens), run against the BUILT package (dist/).
//
// Run:  npm run build && npm test
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
const packageRoot = path.resolve(here, "..");
const distEntry = path.resolve(packageRoot, "dist/index.mjs");
const core = await import(distEntry);

async function freePort() {
    const srv = net.createServer();
    await new Promise((resolve) => srv.listen(0, "127.0.0.1", resolve));
    const { port } = srv.address();
    await new Promise((resolve) => srv.close(resolve));
    return port;
}

/** Runs an ES module script in a scratch directory holding `envFile` as .env; resolves with its stdout + stderr. */
async function runScript(script, envFile = "") {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "opticore-core-upgrade-"));
    fs.writeFileSync(path.join(dir, ".env"), envFile);
    try {
        return await new Promise((resolve, reject) => {
            const child = spawn(process.execPath, ["--input-type=module", "-e", script], { cwd: dir, env: { ...process.env } });
            let out = "";
            child.stdout.on("data", (d) => { out += d; });
            child.stderr.on("data", (d) => { out += d; });
            const timer = setTimeout(() => { child.kill("SIGKILL"); reject(new Error("timeout:\n" + out)); }, 20_000);
            child.on("exit", () => { clearTimeout(timer); resolve(out.replace(/\x1b\[[0-9;]*m/g, "")); });
        });
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

function resultOf(output) {
    const line = output.split("\n").find((l) => l.startsWith("RESULT"));
    assert.ok(line, "the child produced a result:\n" + output);
    return JSON.parse(line.slice("RESULT".length));
}

/* ------------------------------------------------------------------ process listeners (Node 26, DEP0160) */

test("the server bootstrap no longer subscribes to multipleResolves and keeps the other process listeners", async () => {
    const output = await runScript(`
        const { eventProcessHandler, event } = await import(${JSON.stringify(distEntry)});
        const names = ["multipleResolves", "unhandledRejection", "uncaughtException", "rejectionHandled", "warning", "SIGINT", "SIGTERM"];
        const before = Object.fromEntries(names.map((n) => [n, process.listenerCount(n)]));
        eventProcessHandler();
        const after = Object.fromEntries(names.map((n) => [n, process.listenerCount(n) - before[n]]));
        process.stdout.write("RESULT" + JSON.stringify({ after, eventKeys: Object.keys(event) }) + "\\n");
        process.exit(0);
    `);
    const { after, eventKeys } = resultOf(output);
    assert.equal(after.multipleResolves, 0);
    for (const name of ["unhandledRejection", "uncaughtException", "rejectionHandled", "warning", "SIGINT", "SIGTERM"]) {
        assert.equal(after[name], 1, `${name} must still be listened to`);
    }
    assert.ok(!eventKeys.includes("multipleResolves"), "the public event constants no longer list multipleResolves");
    assert.doesNotMatch(output, /DEP0160/);
});

/* ------------------------------------------------------------------ express 5 routing */

test("CoreApplication mounts feature routes with Express 5 path syntax (params, /*splat, optional {/:x}, req.query)", async () => {
    const port = await freePort();
    const output = await runScript(`
        const { CoreApplication, express } = await import(${JSON.stringify(distEntry)});
        const users = express.Router();
        users.get("/:id", (req, res) => res.json({ params: req.params, query: req.query }));
        const files = express.Router();
        files.get("/*splat", (req, res) => res.json({ splat: req.params.splat }));
        const docs = express.Router();
        docs.get("{/:lang}", (req, res) => res.json({ lang: req.params.lang ?? null }));
        const app = new CoreApplication(express());
        const server = app.onStartServer([{ featureRoute: [
            { path: "/api/users", handler: users },
            { path: "/files", handler: files },
            { path: "/docs", handler: docs },
        ] }]);
        server.once("listening", async () => {
            await new Promise((r) => setTimeout(r, 50));
            const base = "http://127.0.0.1:${port}";
            const get = async (p) => { const r = await fetch(base + p); return { status: r.status, body: await r.json().catch(() => null) }; };
            const result = {
                user: await get("/api/users/42?page=2&a[b]=1"),
                splat: await get("/files/a/b/c.txt"),
                docsDefault: await get("/docs"),
                docsLang: await get("/docs/fr"),
                missing: (await fetch(base + "/nowhere")).status,
            };
            process.stdout.write("RESULT" + JSON.stringify(result) + "\\n");
            process.exit(0);
        });
    `, `APP_HOST=127.0.0.1\nAPP_PORT=${port}\n`);
    const result = resultOf(output);
    assert.equal(result.user.status, 200);
    assert.deepEqual(result.user.body.params, { id: "42" });
    // Express 5 default query parser is "simple": no nested objects built from brackets.
    assert.deepEqual(result.user.body.query, { page: "2", "a[b]": "1" });
    assert.deepEqual(result.splat.body, { splat: ["a", "b", "c.txt"] });
    assert.deepEqual(result.docsDefault.body, { lang: null });
    assert.deepEqual(result.docsLang.body, { lang: "fr" });
    assert.equal(result.missing, 404);
});

test("a legacy Express 4 route path is refused with an explicit message, and the server keeps running", async () => {
    const port = await freePort();
    const output = await runScript(`
        const { CoreApplication, express } = await import(${JSON.stringify(distEntry)});
        const router = express.Router();
        const app = new CoreApplication(express());
        const server = app.onStartServer([{ featureRoute: [{ path: "/legacy/:id?", handler: router }] }]);
        server.once("listening", async () => {
            await new Promise((r) => setTimeout(r, 50));
            process.stdout.write("RESULT" + JSON.stringify({ listening: server.listening }) + "\\n");
            process.exit(0);
        });
    `, `APP_HOST=127.0.0.1\nAPP_PORT=${port}\n`);
    assert.equal(resultOf(output).listening, true);
    assert.match(output, /Invalid route path "\/legacy\/:id\?" for Express 5/);
    assert.match(output, /\{\/:param\}/);
});

test("ExpressRoutesUtils lists the routes of an Express 5 application with mounted routers without throwing", () => {
    const { express, ExpressRoutesUtils } = core;
    const app = express();
    const router = express.Router();
    router.get("/items/:id", (req, res) => res.end());
    app.use("/api", router);
    app.post("/login", (req, res) => res.end());
    const routes = new ExpressRoutesUtils().expressListRoutes(app, {});
    assert.ok(routes.some((r) => r.method === "POST" && r.path === "/login"), JSON.stringify(routes));
    assert.ok(routes.some((r) => r.method === "GET" && r.path.endsWith("/items/:id")), JSON.stringify(routes));
    assert.equal(ExpressRoutesUtils.getPathFromRegex(undefined), "");
});

/* ------------------------------------------------------------------ tokens */

test("randToken draws its characters from crypto.randomBytes and keeps rand-token's API", () => {
    const { randToken } = core;
    const original = crypto.randomBytes;
    let calls = 0;
    crypto.randomBytes = (size) => { calls++; return original(size); };
    try {
        const token = randToken.generate(32);
        assert.match(token, /^[0-9A-Za-z]{32}$/);
        assert.match(randToken.uid(16), /^[0-9A-Za-z]{16}$/);
        assert.match(randToken.generate(12, "0123456789"), /^\d{12}$/);
        assert.match(randToken.generator({ chars: "base32" }).generate(20), /^[A-Z2-7]{20}$/);
        // "math" no longer means Math.random: it is served by crypto as well.
        const before = calls;
        const random = Math.random;
        Math.random = () => { throw new Error("Math.random must not be used for tokens"); };
        try {
            assert.match(randToken.generator({ chars: "numeric", source: "math" }).generate(10), /^\d{10}$/);
        } finally {
            Math.random = random;
        }
        assert.ok(calls > before);
        assert.match(randToken.suid(10), /^[0-9A-Za-z]{18}$/);
    } finally {
        crypto.randomBytes = original;
    }
    assert.ok(calls >= 5, `crypto.randomBytes was called ${calls} times`);
    assert.notEqual(randToken.generate(32), randToken.generate(32));
    assert.throws(() => randToken.generate(-1), RangeError);
    assert.throws(() => randToken.generator({ chars: "x".repeat(300) }), TypeError);
});

test("randToken has no modulo bias over a 62-character alphabet", () => {
    const counts = new Map();
    const sample = core.randToken.generate(62 * 2000);
    for (const ch of sample) counts.set(ch, (counts.get(ch) ?? 0) + 1);
    assert.equal(counts.size, 62);
    for (const [ch, n] of counts) {
        assert.ok(n > 1500 && n < 2500, `character ${ch} drawn ${n} times`);
    }
});

/* ------------------------------------------------------------------ mysql2 */

test("mySQL is the mysql2 driver: values are escaped as parameters", () => {
    const { mySQL } = core;
    assert.equal(typeof mySQL.createConnection, "function");
    assert.equal(typeof mySQL.createPool, "function");
    const sql = mySQL.format("SELECT * FROM users WHERE email = ? AND id = ?", ["x' OR '1'='1", "1; DROP TABLE users"]);
    assert.equal(sql, "SELECT * FROM users WHERE email = 'x\\' OR \\'1\\'=\\'1' AND id = '1; DROP TABLE users'");
});

test("the MySQL connection check reports a failure without leaking the password or passing bogus options", async () => {
    const port = await freePort();
    const output = await runScript(`
        const { mySqlCheckerDatabase, optionalArgumentConnection } = await import(${JSON.stringify(distEntry)});
        mySqlCheckerDatabase(optionalArgumentConnection);
        setTimeout(() => { process.stdout.write("RESULT{}\\n"); process.exit(0); }, 1500);
    `, [
        "DATA_BASE_HOST=127.0.0.1",
        `DATA_BASE_PORT=${port}`,
        "DATA_BASE_USER=app",
        "DATA_BASE_PASSWORD=Sup3r-S3cret@pw",
        "DATA_BASE_NAME=shop",
        "",
    ].join("\n"));
    resultOf(output);
    assert.match(output, /ECONNREFUSED/);
    assert.ok(!output.includes("Sup3r-S3cret"), output);
    assert.ok(!output.includes("Sup3r-S3cret".replace("@", "%40")), output);
    assert.doesNotMatch(output, /Ignoring invalid configuration option/);
});

/* ------------------------------------------------------------------ dependencies */

test("unused and unmaintained runtime dependencies are gone", () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
    const deps = Object.keys(pkg.dependencies ?? {});
    for (const removed of ["mysql", "rand-token", "helmet", "hpp", "express-rate-limit", "express-session", "cookie-session",
        "express-useragent", "envalid", "edit-json-file", "gradient-string", "opticore-database", "passport-local",
        "passport-strategy", "body-parser", "@types/body-parser"]) {
        assert.ok(!deps.includes(removed), `${removed} is still a dependency`);
    }
    assert.ok(deps.includes("mysql2"));
    const dist = fs.readFileSync(distEntry, "utf8");
    assert.doesNotMatch(dist, /from ["']rand-token["']|from ["']mysql["']/);
});
