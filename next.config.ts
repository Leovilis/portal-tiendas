import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        // Fotos de producto subidas por los vendedores al bucket "productos"
        // de Supabase Storage.
        protocol: "https",
        hostname: "ennnwbhtcxsvpejlwawe.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
