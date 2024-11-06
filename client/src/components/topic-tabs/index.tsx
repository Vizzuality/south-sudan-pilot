"use client";

import { ReactNode, useCallback, useMemo } from "react";

import DroughtPanel from "@/components/panels/drought";
import FloodPanel from "@/components/panels/flood";
import HydrometeorologicalPanel from "@/components/panels/hydrometeorological";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTopicTab from "@/hooks/use-topic-tab";

import { TopicTab } from "./types";

const TopicTabs = () => {
  const [tab, setTab] = useTopicTab();

  const tabTriggers = useMemo(
    () =>
      Object.entries(TopicTab).map(([name, value]) => (
        <TabsTrigger key={value} value={value}>
          {name}
        </TabsTrigger>
      )),
    [],
  );

  const tabContents = useMemo(() => {
    const contentByTopic: Record<TopicTab, ReactNode> = {
      [TopicTab.Flood]: <FloodPanel />,
      [TopicTab.Drought]: <DroughtPanel />,
      [TopicTab.Hydrometeorological]: <HydrometeorologicalPanel />,
    };

    return Object.values(TopicTab).map((value) => (
      <TabsContent key={value} value={value}>
        {contentByTopic[value]}
      </TabsContent>
    ));
  }, []);

  const onChangeTab = useCallback(
    (tab: string) => {
      setTab(tab as TopicTab);
    },
    [setTab],
  );

  return (
    <Tabs value={tab} onValueChange={onChangeTab}>
      <TabsList>{tabTriggers}</TabsList>
      {tabContents}
    </Tabs>
  );
};

export default TopicTabs;
