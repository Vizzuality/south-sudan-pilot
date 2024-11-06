import { parseAsStringEnum, useQueryState } from "nuqs";

import { TopicTab } from "@/components/topic-tabs/types";

export default function useTopicTab() {
  return useQueryState(
    "tab",
    parseAsStringEnum<TopicTab>(Object.values(TopicTab)).withDefault(TopicTab.Flood),
  );
}
