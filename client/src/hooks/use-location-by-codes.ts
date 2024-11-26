import { useQueries } from "@tanstack/react-query";

import { getGetLocationsQueryKey, getLocations } from "@/types/generated/location";
import { GetLocationsParams, LocationListResponse } from "@/types/generated/strapi.schemas";

type LocationByCode = {
  id: number;
  name: string;
  code: string;
};

export function useLocationByCodes(codes: string[]) {
  const { data, isLoading } = useQueries({
    queries: codes.map((code) => {
      const queryParams: GetLocationsParams = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore-error
        fields: ["name", "code"],
        filters: {
          code: {
            $eq: code,
          },
        },
        sort: "name",
        "pagination[limit]": 1,
      };

      return {
        queryKey: getGetLocationsQueryKey(queryParams),
        queryFn: () => getLocations(queryParams),
        placeholderData: { data: undefined },
        select: (data: LocationListResponse) => {
          if (!data?.data || data.data.length === 0) {
            return undefined;
          }

          return {
            id: data.data[0].id,
            name: data.data[0].attributes!.name!,
            code: data.data[0].attributes!.code!,
          } as LocationByCode;
        },
      };
    }),
    combine: (results) => {
      const isLoading = results.some(({ isPending }) => isPending);

      return {
        data: isLoading ? undefined : results.map(({ data }) => data!),
        isLoading,
      };
    },
  });

  return { data, isLoading };
}
