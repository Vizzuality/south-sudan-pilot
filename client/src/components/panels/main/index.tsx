import DatasetTabs from "@/components/topic-tabs";
import useTopicTabLayerManagement from "@/hooks/use-topic-tab-layer-management";

const MainPanel = () => {
  useTopicTabLayerManagement();

  return (
    <div className="-mx-5 lg:mx-0">
      <DatasetTabs />
    </div>
  );
};

export default MainPanel;
