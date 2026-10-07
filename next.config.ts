import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Blog cover images (src/components/molecules/blogData.ts) are served from the Missio CMS
    remotePatterns: [
      { protocol: "https", hostname: "vold.missio.io", pathname: "/user-uploads/public/blog-images/**" },
      // Images inside article bodies (src/content/blog-posts.json)
      { protocol: "https", hostname: "admin.missio.io", pathname: "/portal/files/**" },
    ],
  },
};

export default nextConfig;
