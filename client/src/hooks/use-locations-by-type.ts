import { useGetLocations } from "@/types/generated/location";

type LocationByType = {
  id: number;
  name: string;
  code: string;
};

export default function useLocationsByType(
  type: string,
  level?: number,
  parentCode?: string,
  enabled = true,
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore-error
  const { data, isLoading } = useGetLocations<LocationByType[]>(
    {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-error
      fields: ["name", "code"],
      filters: {
        type: {
          $eq: type,
        },
        ...(level !== undefined
          ? {
              level: {
                $eq: level,
              },
            }
          : {}),
        ...(parentCode !== undefined
          ? {
              parent: {
                code: {
                  $eq: parentCode,
                },
              },
            }
          : {}),
      },
      sort: "name",
    },
    {
      query: {
        enabled,
        placeholderData: { data: [] },
        select: (data) => {
          if (!data?.data) {
            return [];
          }

          return data.data.map(({ id, attributes }) => ({
            id,
            name: attributes!.name!,
            code: attributes!.code!,
          }));
        },
      },
    },
  );

  return { data, isLoading };
}
