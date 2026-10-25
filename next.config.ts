import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // окремої сторінки /notes немає — список нотаток живе в /notes/filter/[...slug]
  async redirects() {
    return [
      {
        source: "/notes",
        destination: "/notes/filter/all",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
