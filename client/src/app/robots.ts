import { env } from "@/env";

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  if (env.NEXT_USE_RESTRICTIVE_ROBOTS_TXT) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
  };
}
