import chalkImport, { type ChalkInstance } from "chalk";

/**
 * Returns chalk's default instance, the same singleton in both builds of this package.
 *
 * chalk is ESM-only. In the ESM build the default import is the chalk instance; in the CommonJS
 * build, `require("chalk")` (require(esm)) returns the module namespace and the bundler's Node-mode
 * interop wraps it again, so the default import is the namespace and the instance sits on its
 * `default` property. Reading `chalk.default.hex` there used to crash with
 * "Cannot read properties of undefined (reading 'hex')". Resolving the singleton (rather than
 * creating a `new Chalk()`) keeps `chalk.level` changes (e.g. forceOpticoreColors) shared by every caller.
 */
function resolveChalk(): ChalkInstance {
    const imported = chalkImport as ChalkInstance & { default?: ChalkInstance };
    return typeof imported.hex === "function" ? imported : (imported.default as ChalkInstance);
}

export const chalk: ChalkInstance = resolveChalk();
