import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// Vite configuration
export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],
});

