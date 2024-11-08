import { useEffect, useMemo, useRef } from "react";

import useDatasetsBySubTopic from "@/hooks/use-datasets-by-sub-topic";
import useMapLayers from "@/hooks/use-map-layers";
import useTopicTab from "@/hooks/use-topic-tab";

export default function useTopicTabLayerManagement() {
  const [tab] = useTopicTab();
  const previousTabRef = useRef(tab);

  const [layers, { addLayer, removeLayer }] = useMapLayers();

  const { data, isLoading } = useDatasetsBySubTopic(tab, "sub_topic.name:desc,name");

  // The ids of all the layers that belong to the topic
  const topicLayerIds = useMemo(() => {
    if (isLoading) {
      return [];
    }

    return data
      .map(({ datasets }) => datasets.map(({ layers }) => layers.map(({ id }) => id!)))
      .flat(Infinity) as number[];
  }, [data, isLoading]);

  const previousTopicLayerIdsRef = useRef(topicLayerIds);

  // The ids of all the active layers that belong to the topic
  const activeTopicLayerIds = useMemo(() => {
    const activeLayerIds = layers.map(({ id }) => id!);
    return topicLayerIds.filter((id) => activeLayerIds.includes(id));
  }, [topicLayerIds, layers]);

  // The id of the layer that should be active by default
  const defaultActiveLayerId = useMemo(() => {
    if (isLoading) {
      return undefined;
    }

    const firstDataset = data[0]?.datasets[0];
    return firstDataset?.defaultLayerId;
  }, [data, isLoading]);

  const previousDefaultActiveLayerIdRef = useRef(defaultActiveLayerId);

  // We toggle on the default layer of the first dataset when entering the tab (topic) i.e. when:
  //   1. There is no active layer from the topic
  //   2. We have a default layer (i.e. `defaultActiveLayerId !== undefined`)
  //   3. One of these two (OR condition):
  //     a) We've just gotten a value for `defaultActiveLayerId`
  //     b) We've just entered the tab (topic)
  // Condition 3a is important to avoid activating the default layer when the user remove all the
  // topic's layers from the map
  useEffect(() => {
    if (
      activeTopicLayerIds.length === 0 &&
      defaultActiveLayerId !== undefined &&
      (previousDefaultActiveLayerIdRef.current === undefined || tab !== previousTabRef.current)
    ) {
      addLayer(defaultActiveLayerId);
    }

    previousDefaultActiveLayerIdRef.current = defaultActiveLayerId;
  }, [activeTopicLayerIds, defaultActiveLayerId, tab, addLayer]);

  // We remove the tab's (topic's) layers from the map when switching to a different tab (topic)
  useEffect(() => {
    if (
      tab !== previousTabRef.current &&
      !!previousTabRef.current &&
      !!previousTopicLayerIdsRef.current
    ) {
      previousTopicLayerIdsRef.current.forEach((id) => {
        removeLayer(id);
      });
    }

    previousTabRef.current = tab;
    previousTopicLayerIdsRef.current = topicLayerIds;
  }, [tab, topicLayerIds, removeLayer]);
}
