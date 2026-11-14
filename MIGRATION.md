# Migrating to the Node 26 / dependency-majors release of opticore-core-module

This release requires **Node.js >= 26.12.1** and moves every dependency re-exported by `opticore-core-module` to its
latest major. What an application built on it must check:

## Packaging (build with tsdown, explicit `exports`)
The package is now built with tsdown (TypeScript 7) and its entry points are declared in `exports`:

| Consumer | File loaded before | File loaded now |
|---|---|---|
| `require("opticore-core-module")` | `dist/index.js` (`main`, the ESM build: `dist/index.cjs` was never used) | `dist/index.cjs` |
| `import … from "opticore-core-module"` | `dist/index.js` (`module` named `dist/index.mjs`, which did not exist) | `dist/index.mjs` |
| types for `require` / `import` | `dist/index.d.ts` (`types`) for both | `dist/index.d.cts` / `dist/index.d.mts` |

- Importing the package by its name is unchanged. Deep imports are no longer allowed by `exports`:
  `opticore-core-module/dist/index.js` (and any other `dist/…` path) now fails with `ERR_PACKAGE_PATH_NOT_EXPORTED`;
  import `opticore-core-module` instead (`opticore-core-module/package.json` stays reachable).
- `dist/index.js` and `dist/index.d.ts` are no longer produced: tooling or scripts pointing at them must use
  `dist/index.mjs` / `dist/index.cjs` and `dist/index.d.mts` / `dist/index.d.cts`.
- A CommonJS application now loads a real CommonJS build instead of the ESM one through `require(esm)`. An application
  that both `require`s and `import`s the core gets two separate instances (module-level state is not shared): use one style.
- The published tarball only contains `dist/`, `MIGRATION.md` and `package.json` (`"files"`).

## Node 26
- `process.on("multipleResolves")` is gone from Node (DEP0160): the core no longer subscribes to it and the
  `event` constants no longer contain `multipleResolves`. Remove any listener of your own.

## Express 5 (`express`, `Router`, the `featureRoute` paths given to `CoreApplication`)
- Path syntax (path-to-regexp 8):
  - wildcard `*` → named wildcard `/*splat` (the value is an array: `req.params.splat`); `/*` alone is invalid;
  - optional parameter `/:id?` → `{/:id}`;
  - no inline regular expressions (`/:id(\\d+)`, `/(.*)`): validate in the handler instead;
  - `(`, `)`, `[`, `]`, `?`, `+`, `!` are reserved characters: escape them with `\\`.
  `CoreApplication` now refuses a legacy path with an explicit "Invalid route path … for Express 5" error.
- `req.query` is a getter: it cannot be reassigned (`req.query = …` throws in strict mode); mutate a copy instead.
  The default query parser is now `"simple"` (`?a[b]=1` gives `{ "a[b]": "1" }`); set `app.set("query parser", "extended")`
  if you relied on nested objects.
- Removed APIs: `req.param(name)` (use `req.params` / `req.body` / `req.query`), `res.sendfile` (`res.sendFile`),
  `app.del` (`app.delete`), `res.json(status, body)` / `res.send(status, body)` (`res.status(s).json(body)`),
  `res.send(number)` (`res.sendStatus`), `res.redirect("back")` (`res.redirect(req.get("Referrer") || "/")`),
  `req.acceptsCharset/Encoding/Language` (plural forms), `express.static.mime`.
- `req.host` keeps the port; `req.body` is `undefined` (not `{}`) when no body parser matched.
- Rejected promises returned by handlers are forwarded to the error handler: no need to `try/catch` + `next(err)`.
- `app.listen(port, host, cb)`: `cb` also receives the listen error (EADDRINUSE…).

## body-parser 2 (`express.json/urlencoded/raw/text`)
- `express.urlencoded()` defaults to `extended: false` (pass `{ extended: true }` for nested objects, depth limited to 32).
- `body-parser` is no longer a direct dependency of the core: use `express.json()` & co (or install it yourself).

## Prisma 7 (`PrismaClient` re-exported from `@prisma/client`)
- The core only re-exports `PrismaClient`; it never instantiates it. In your app:
  - generator `provider = "prisma-client"` with an explicit `output` (import `PrismaClient` from that path),
    or keep `prisma-client-js` (the `@prisma/client` re-export still works, it is deprecated upstream);
  - a driver adapter is **required** for SQL databases:
    `new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })`
    (`@prisma/adapter-pg` + `pg`, `@prisma/adapter-mariadb` + `mariadb` for MySQL…);
  - the datasource URL moves to `prisma.config.ts` (`defineConfig({ datasource: { url: env("DATABASE_URL") } })`),
    and `.env` is no longer loaded automatically by the CLI (`import "dotenv/config"` in that file);
  - `$use()` middleware → client extensions; `Prisma.validator()` → `satisfies`.
- **Prisma 7 has no MongoDB connector**: a MongoDB Prisma project must stay on Prisma 6 (pin `prisma`/`@prisma/client` `^6`).

## mongodb 7 (`MongoClient`, `Db`)
- Node >= 20.19 required (satisfied). Callback APIs have been gone since v5: use promises.
- `mongoCheckerDatabase` now pings the database and closes its client after the check.

## MySQL: `mysql` → `mysql2`
- The `mySQL` export is now the `mysql2` callback API (`createConnection`, `createPool`, `format`, `escape`…).
- Types: `mySQL.MysqlError` → `import type { QueryError } from "mysql2"`, `mySQL.Connection` → `Connection`.
- Always pass values as parameters: `connection.query("SELECT * FROM t WHERE id = ?", [id], cb)`
  (or `connection.execute` for server-side prepared statements). Never build SQL by concatenation.
- For promises, `import mysql from "mysql2/promise"` in your app.
- `ARGUMENTS_DATABASE_CONNECTION` may now be written with or without its leading `?`.

## dotenv 18
- CommonJS-only package (default import works from ESM); `config()` prints a banner unless `{ quiet: true }`
  (the core passes it). Values containing `#` must be quoted.

## Other majors re-exported
- `inversify` 8 (from 6): the `injectable` decorator re-exported by the core is unchanged; the `Container` API changed
  across v7/v8 — follow inversify's migration guides if your app uses the container directly.
- `bcrypt` 6: same `hash/compare/genSalt` API; prebuilt binaries for current Node only.

## Dependencies removed from the core
`helmet`, `hpp`, `express-rate-limit`, `express-session`, `cookie-session`, `express-useragent`, `envalid`,
`edit-json-file`, `gradient-string`, `opticore-database`, `passport-local`, `passport-strategy`, `body-parser`,
`@types/body-parser`, `mysql`, `rand-token`. None was imported or re-exported by the core: if your application uses
one of them, add it to its own `package.json`.

## `randToken`
- Same API (`generate`, `uid`, `suid`, `generator`), now implemented with `node:crypto` (`randomBytes`, rejection
  sampling). The `"math"` source no longer uses `Math.random`.
