import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pixelbind",
    short_name: "Pixelbind",
    description:
      "PixelBind is a simple and powerful web tool that lets you quickly convert your images into high-quality PDFs.",
    start_url: "/app",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        "src": "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        "src": "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
