import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@napi-rs/canvas", "pdfjs-dist"],
  turbopack: {
    // Explicitly pin the project root so builds don't try to run from ~/ when multiple lockfiles exist
    root: __dirname,
  },
};

export default nextConfig;
