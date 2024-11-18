import { parseAsJson, useQueryState } from "nuqs";
import { z } from "zod";

const schema = z.object({
  type: z.enum(["administrative", "hydrological"]),
  code: z.array(z.string()),
});

export default function useLocation() {
  return useQueryState(
    "location",
    parseAsJson(schema.parse).withDefault({
      type: "administrative",
      code: [],
    }),
  );
}
