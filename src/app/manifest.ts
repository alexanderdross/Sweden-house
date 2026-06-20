import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flatön Coastal House, Bohuslän, Sweden",
    short_name: "Flatön House",
    description:
      "Direct booking for a modern holiday house on Flatön in Bohuslän's archipelago.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f1",
    theme_color: "#2a4d68",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
