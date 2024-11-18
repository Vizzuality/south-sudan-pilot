import { defineConfig } from "orval";

export default defineConfig({
  cms: {
    input: {
      target: "../../cms/src/extensions/documentation/documentation/1.0.0/full_documentation.json",
      filters: {
        tags: ["Topic", "Sub-topic", "Dataset", "Layer", "Chart-data", "Location"],
      },
    },
    output: {
      target: "./types/generated/strapi.ts",
      mode: "tags",
      client: "react-query",
      clean: true,
      override: {
        mutator: {
          path: "./services/api.ts",
          name: "API",
        },
        query: {
          useQuery: true,
          signal: true,
        },
      },
    },
  },
});
