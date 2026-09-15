import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],

  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.js"),
      name: "ReactAuthKit",
      formats: ["es", "cjs"],
      fileName: (format) => {
        if (format === "es") {
          return "react-auth-kit.js";
        }

        return "react-auth-kit.cjs";
      },
    },

    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@mui/material",
        "@emotion/react",
        "@emotion/styled",
      ],
    },
  },
});