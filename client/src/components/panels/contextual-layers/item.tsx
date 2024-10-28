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
          <li key={layer.id} className="py-2">
            <span className="text-xl">{layer.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Item;
