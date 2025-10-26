import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig({
  root: path.resolve(__dirname, "client"),

  server: {
    host: '0.0.0.0', // ✅ Make server accessible on LAN (your phone)
    port: 5173,       // 🔁 Optional: change if needed
    fs: {
      allow: [
        path.resolve(__dirname, "client"),
        path.resolve(__dirname, "shared"),
      ],
    },
  },

  plugins: [react(), expressPlugin()],

  build: {
    outDir: path.resolve(__dirname, "dist/spa"),
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
});

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    configureServer(server) {
      const app = createServer();

      // Mount Express app as middleware
      server.middlewares.use(app);
    },
  };
}
