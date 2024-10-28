import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dataset, Layer } from "@/types/generated/strapi.schemas";

interface ItemProps {
  name: Dataset["name"];
  layers: { id: number; name: Layer["name"] }[];
}

const Item = ({ name, layers }: ItemProps) => {
  return (
    <div>
      <div className="border-b border-casper-blue-400/50 py-2 uppercase">{name}</div>
      <ul className="py-2">
        {layers.map((layer) => (
          <li key={layer.id} className="flex items-start justify-between gap-4 py-2">
            <Label htmlFor={`${layer.id}-toggle`} className="text-xl">
              {layer.name}
            </Label>
            <div className="pt-1">
              <Switch id={`${layer.id}-toggle`} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Item;
