// vite.config.ts
import { defineConfig } from "file:///Users/robzhuang/Documents/GitHub/sprinter-ts/packages/react/node_modules/vite/dist/node/index.js";
import { extname, relative, resolve } from "path";
import { fileURLToPath } from "node:url";
import react from "file:///Users/robzhuang/Documents/GitHub/sprinter-ts/packages/react/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///Users/robzhuang/Documents/GitHub/sprinter-ts/packages/react/node_modules/vite-plugin-dts/dist/index.mjs";
import { glob } from "file:///Users/robzhuang/Documents/GitHub/sprinter-ts/node_modules/glob/dist/esm/index.js";
var __vite_injected_original_dirname = "/Users/robzhuang/Documents/GitHub/sprinter-ts/packages/react";
var __vite_injected_original_import_meta_url = "file:///Users/robzhuang/Documents/GitHub/sprinter-ts/packages/react/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    dts({ tsconfigPath: resolve(__vite_injected_original_dirname, "tsconfig.lib.json") })
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__vite_injected_original_dirname, "lib/main.ts"),
      formats: ["es"]
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      input: Object.fromEntries(
        // https://rollupjs.org/configuration-options/#input
        glob.sync("lib/**/*.{ts,tsx}", {
          ignore: ["lib/**/*.d.ts"]
        }).map((file) => [
          // 1. The name of the entry point
          // lib/nested/foo.js becomes nested/foo
          relative("lib", file.slice(0, file.length - extname(file).length)),
          // 2. The absolute path to the entry file
          // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
          fileURLToPath(new URL(file, __vite_injected_original_import_meta_url))
        ])
      ),
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcm9iemh1YW5nL0RvY3VtZW50cy9HaXRIdWIvc3ByaW50ZXItdHMvcGFja2FnZXMvcmVhY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9yb2J6aHVhbmcvRG9jdW1lbnRzL0dpdEh1Yi9zcHJpbnRlci10cy9wYWNrYWdlcy9yZWFjdC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvcm9iemh1YW5nL0RvY3VtZW50cy9HaXRIdWIvc3ByaW50ZXItdHMvcGFja2FnZXMvcmVhY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgZXh0bmFtZSwgcmVsYXRpdmUsIHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gXCJub2RlOnVybFwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IGR0cyBmcm9tIFwidml0ZS1wbHVnaW4tZHRzXCI7XG5pbXBvcnQgeyBnbG9iIH0gZnJvbSBcImdsb2JcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGR0cyh7IHRzY29uZmlnUGF0aDogcmVzb2x2ZShfX2Rpcm5hbWUsIFwidHNjb25maWcubGliLmpzb25cIikgfSksXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgY29weVB1YmxpY0RpcjogZmFsc2UsXG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsIFwibGliL21haW4udHNcIiksXG4gICAgICBmb3JtYXRzOiBbXCJlc1wiXSxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbXCJyZWFjdFwiLCBcInJlYWN0L2pzeC1ydW50aW1lXCJdLFxuICAgICAgaW5wdXQ6IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgICAgLy8gaHR0cHM6Ly9yb2xsdXBqcy5vcmcvY29uZmlndXJhdGlvbi1vcHRpb25zLyNpbnB1dFxuICAgICAgICBnbG9iXG4gICAgICAgICAgLnN5bmMoXCJsaWIvKiovKi57dHMsdHN4fVwiLCB7XG4gICAgICAgICAgICBpZ25vcmU6IFtcImxpYi8qKi8qLmQudHNcIl0sXG4gICAgICAgICAgfSlcbiAgICAgICAgICAubWFwKChmaWxlKSA9PiBbXG4gICAgICAgICAgICAvLyAxLiBUaGUgbmFtZSBvZiB0aGUgZW50cnkgcG9pbnRcbiAgICAgICAgICAgIC8vIGxpYi9uZXN0ZWQvZm9vLmpzIGJlY29tZXMgbmVzdGVkL2Zvb1xuICAgICAgICAgICAgcmVsYXRpdmUoXCJsaWJcIiwgZmlsZS5zbGljZSgwLCBmaWxlLmxlbmd0aCAtIGV4dG5hbWUoZmlsZSkubGVuZ3RoKSksXG4gICAgICAgICAgICAvLyAyLiBUaGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgZW50cnkgZmlsZVxuICAgICAgICAgICAgLy8gbGliL25lc3RlZC9mb28udHMgYmVjb21lcyAvcHJvamVjdC9saWIvbmVzdGVkL2Zvby50c1xuICAgICAgICAgICAgZmlsZVVSTFRvUGF0aChuZXcgVVJMKGZpbGUsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgICAgIF0pLFxuICAgICAgKSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBhc3NldEZpbGVOYW1lczogXCJhc3NldHMvW25hbWVdW2V4dG5hbWVdXCIsXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiBcIltuYW1lXS5qc1wiLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNXLFNBQVMsb0JBQW9CO0FBQ25ZLFNBQVMsU0FBUyxVQUFVLGVBQWU7QUFDM0MsU0FBUyxxQkFBcUI7QUFDOUIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUNoQixTQUFTLFlBQVk7QUFMckIsSUFBTSxtQ0FBbUM7QUFBdUwsSUFBTSwyQ0FBMkM7QUFRalIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sSUFBSSxFQUFFLGNBQWMsUUFBUSxrQ0FBVyxtQkFBbUIsRUFBRSxDQUFDO0FBQUEsRUFDL0Q7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxJQUNmLEtBQUs7QUFBQSxNQUNILE9BQU8sUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDdkMsU0FBUyxDQUFDLElBQUk7QUFBQSxJQUNoQjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLFNBQVMsbUJBQW1CO0FBQUEsTUFDdkMsT0FBTyxPQUFPO0FBQUE7QUFBQSxRQUVaLEtBQ0csS0FBSyxxQkFBcUI7QUFBQSxVQUN6QixRQUFRLENBQUMsZUFBZTtBQUFBLFFBQzFCLENBQUMsRUFDQSxJQUFJLENBQUMsU0FBUztBQUFBO0FBQUE7QUFBQSxVQUdiLFNBQVMsT0FBTyxLQUFLLE1BQU0sR0FBRyxLQUFLLFNBQVMsUUFBUSxJQUFJLEVBQUUsTUFBTSxDQUFDO0FBQUE7QUFBQTtBQUFBLFVBR2pFLGNBQWMsSUFBSSxJQUFJLE1BQU0sd0NBQWUsQ0FBQztBQUFBLFFBQzlDLENBQUM7QUFBQSxNQUNMO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
