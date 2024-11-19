import { AllGeoJSON } from "@turf/helpers";

import { useGetLocations } from "@/types/generated/location";

export function useLocationGeometry(code: string | undefined) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore-error
  const { data, isLoading } = useGetLocations<AllGeoJSON>(
    {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-error
      fields: ["geometry"],
      filters: {
        code: {
          $eq: code,
        },
      },
      sort: "name",
      "pagination[limit]": 1,
    },
    {
      query: {
        enabled: code !== undefined,
        placeholderData: { data: undefined },
        select: (data) => {
          if (!data?.data || data.data.length === 0) {
            return undefined;
          }

          return data.data[0].attributes!.geometry;
        },
      },
    },
  );

  return { data, isLoading };
}
