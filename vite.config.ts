import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
      "@assets": "/src/assets",
      "@components": "/src/components",
      "@constants": "/src/constants",
      "@hooks": "/src/hooks",
      "@interfaces": "/src/interfaces",
      "@layouts": "/src/layouts",
      "@pages": "/src/pages",
      "@routes": "/src/routes",
      "@services": "/src/services",
      "@utils": "/src/utils",
    },
  },
});
