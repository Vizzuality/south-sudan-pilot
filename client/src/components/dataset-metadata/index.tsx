import Link from "next/link";

import Markdown from "@/components/markdown";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MetadataItemComponent } from "@/types/generated/strapi.schemas";

interface DatasetMetadataProps {
  name: string;
  metadata: MetadataItemComponent;
}

const DatasetMetadata = ({ name, metadata }: DatasetMetadataProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{name}</DialogTitle>
      </DialogHeader>
      <dl className="mt-8 flex flex-col gap-2 text-xs">
        {!!metadata.full_name && (
          <div>
            <dt className="font-bold">Full name</dt>
            <dd>{metadata.full_name}</dd>
          </div>
        )}
        {!!metadata.source && (
          <div>
            <dt className="font-bold">Source</dt>
            <dd>{metadata.source}</dd>
          </div>
        )}
        {!!metadata.website && (
          <div>
            <dt className="font-bold">Website</dt>
            <dd>
              <Link
                href={metadata.website}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all underline"
              >
                {metadata.website}
              </Link>
            </dd>
          </div>
        )}
        {!!metadata.description && (
          <div>
            <dt className="font-bold">Description</dt>
            <dd>{metadata.description}</dd>
          </div>
        )}
        {!!metadata.main_applications && (
          <div>
            <dt className="font-bold">Main applications</dt>
            <dd>
              <Markdown>{metadata.main_applications}</Markdown>
            </dd>
          </div>
        )}
        {!!metadata.temporal_resolution && (
          <div>
            <dt className="font-bold">Temporal resolution</dt>
            <dd>
              <Markdown>{metadata.temporal_resolution}</Markdown>
            </dd>
          </div>
        )}
        {!!metadata.temporal_coverage && (
          <div>
            <dt className="font-bold">Temporal coverage</dt>
            <dd>
              <Markdown>{metadata.temporal_coverage}</Markdown>
            </dd>
          </div>
        )}
        {!!metadata.spatial_resolution && (
          <div>
            <dt className="font-bold">Spatial resolution</dt>
            <dd>{metadata.spatial_resolution}</dd>
          </div>
        )}
        {!!metadata.units && (
          <div>
            <dt className="font-bold">Units</dt>
            <dd>{metadata.units}</dd>
          </div>
        )}
      </dl>
    </>
  );
};

export default DatasetMetadata;
