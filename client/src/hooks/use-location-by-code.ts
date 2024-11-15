import { useGetLocations } from "@/types/generated/location";

type LocationByCode = {
  id: number;
  name: string;
  code: string;
};

export function useLocationByCode(code: string | undefined) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore-error
  const { data, isLoading } = useGetLocations<LocationByCode>(
    {
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
    },
    {
      query: {
        enabled: code !== undefined,
        placeholderData: { data: undefined },
        select: (data) => {
          if (!data?.data || data.data.length === 0) {
            return undefined;
          }

          return {
            id: data.data[0].id,
            name: data.data[0].attributes!.name!,
            code: data.data[0].attributes!.code!,
          };
        },
      },
    },
  );

  return { data, isLoading };
}
