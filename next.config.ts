import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(
        `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/**`
      ),
    ],
  },
};

export default nextConfig;
