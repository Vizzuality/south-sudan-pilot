import { JSONConverter } from "@deck.gl/json";
import { getYear } from "date-fns";
import { useMemo } from "react";

import { useGetLayersId } from "@/types/generated/layer";
import { LayerType } from "@/types/generated/strapi.schemas";
import {
  LayerConfig,
  LayerInteractionState,
  LayerParamsConfig,
  LayerResolvedParamsConfig,
  LayerSettings,
} from "@/types/layer";

const resolveLayerParamsConfig = (
  paramsConfig: LayerParamsConfig,
  settings: LayerSettings,
  interaction: LayerInteractionState,
): LayerResolvedParamsConfig => {
  const config: LayerResolvedParamsConfig = paramsConfig.reduce((res, param) => {
    const hasSettings = (key: string): key is keyof LayerSettings => {
      return key in settings;
    };

    // No setting for this param, we just keep the default value
    if (!hasSettings(param.key)) {
      return { ...res, [param.key]: param.default };
    }

    // We replace the default by the setting's value
    return {
      ...res,
      [param.key]: settings[param.key] ?? param.default,
    };
  }, {});

  const interactive = config["interactive"] as boolean | undefined | null;
  const featureId = config["feature-id"] as string | undefined | null;

  // If the layer is interactive, we compute the properties related to the interaction
  if (interactive === true && featureId !== undefined && featureId !== null) {
    config["hovered-feature-id"] = interaction.hoveredFeature?.[featureId] ?? "";
    config["selected-feature-id"] = interaction.selectedFeature?.[featureId] ?? "";
  }

  return config;
};

const resolveLayerConfig = (
  config: LayerConfig,
  resolvedParamsConfig: LayerResolvedParamsConfig,
): LayerConfig => {
  const converter = new JSONConverter({
    configuration: {
      functions: {
        setOpacity({ o = 1, base = 1 }: { o: number; base: number }) {
          return o * base;
        },
        setVisibility({ v }: { v: boolean }) {
          return v ? "visible" : "none";
        },
        match({ input, outputs }: { input: unknown; outputs: [unknown, unknown][] }) {
          return outputs.find(([value]) => input === value)?.[1];
        },
        replace({
          string,
          pattern,
          replacement,
        }: {
          string: string;
          pattern: string;
          replacement: string | number;
        }) {
          return string.replace(pattern, `${replacement}`);
        },
        getYear({ date }: { date: string }) {
          return getYear(date);
        },
      },
      enumerations: {
        params: resolvedParamsConfig,
      },
    },
  });

  return converter.convertJson(config);
};

export default function useLayerConfig(
  layerId: number,
  settings: LayerSettings,
  interaction: LayerInteractionState,
) {
  const { data, isLoading } = useGetLayersId(layerId, {
    query: {
      select: (data) => {
        if (!data?.data) {
          return undefined;
        }

        const { type, params_config: paramsConfig, mapbox_config: config } = data.data.attributes!;

        return {
          type,
          paramsConfig,
          config,
        } as { type: LayerType; paramsConfig: LayerParamsConfig; config: LayerConfig };
      },
    },
  });

  const resolvedParamsConfig = useMemo(() => {
    if (isLoading || !data) {
      return undefined;
    }

    return resolveLayerParamsConfig(data.paramsConfig, settings, interaction);
  }, [data, isLoading, settings, interaction]);

  const resolvedConfig = useMemo(() => {
    if (isLoading || !data || !resolvedParamsConfig) {
      return undefined;
    }

    return resolveLayerConfig(data.config, resolvedParamsConfig);
  }, [data, isLoading, resolvedParamsConfig]);

  const type = useMemo(() => {
    if (isLoading || !data) {
      return null;
    }

    return data.type;
  }, [data, isLoading]);

  const interactive = useMemo(() => {
    if (!resolvedParamsConfig) {
      return false;
    }

    return "interactive" in resolvedParamsConfig && resolvedParamsConfig.interactive === true;
  }, [resolvedParamsConfig]);

  if (!type || !resolvedConfig) {
    return undefined;
  }

  return { type, config: resolvedConfig, interactive };
}
