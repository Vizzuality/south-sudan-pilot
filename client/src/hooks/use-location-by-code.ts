import { useGetLocations } from "@/types/generated/location";
import { Location } from "@/types/generated/strapi.schemas";

export function useLocationByCode(code: string | undefined, fields = ["name", "code"]) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore-error
  const { data, isLoading } = useGetLocations<Location | undefined>(
    {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-error
      fields,
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
            ...fields.reduce(
              (res, field) => ({
                ...res,
                [field]: data.data![0].attributes![field as keyof Location],
              }),
              {},
            ),
          };
        },
      },
    },
  );

  return { data, isLoading };
}
