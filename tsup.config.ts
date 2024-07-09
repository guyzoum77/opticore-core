import {defineConfig} from "tsup";

export default defineConfig({
    name: "core-module",
    format: ["cjs", "esm"],
    entry: ['src/index.ts'] ,
    dts: true,
    shims: true,
    skipNodeModulesBundle: true,
    clean: true
});