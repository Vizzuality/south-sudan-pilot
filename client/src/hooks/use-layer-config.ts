import { JSONConverter } from "@deck.gl/json";
import { useMemo } from "react";

import { useGetLayersId } from "@/types/generated/layer";
import {
  LayerConfig,
  LayerParamsConfig,
  LayerResolvedParamsConfig,
  LayerSettings,
} from "@/types/layer";

const resolveLayerParamsConfig = (
  paramsConfig: LayerParamsConfig,
  settings: LayerSettings,
): LayerResolvedParamsConfig => {
  return paramsConfig.reduce((res, param) => {
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
      },
      enumerations: {
        params: resolvedParamsConfig,
      },
    },
  });

  return converter.convertJson(config);
};

export default function useLayerConfig(layerId: number, settings: LayerSettings) {
  const { data, isLoading } = useGetLayersId(layerId, {
    query: {
      select: (data) => {
        if (!data?.data) {
          return undefined;
        }

        const { params_config: paramsConfig, mapbox_config: config } = data.data.attributes!;

        return {
          paramsConfig,
          config,
        } as { paramsConfig: LayerParamsConfig; config: LayerConfig };
      },
    },
  });

  const resolvedParamsConfig = useMemo(() => {
    if (isLoading || !data) {
      return undefined;
    }

    return resolveLayerParamsConfig(data.paramsConfig, settings);
  }, [data, isLoading, settings]);

  const resolvedConfig = useMemo(() => {
    if (isLoading || !data || !resolvedParamsConfig) {
      return undefined;
    }

    return resolveLayerConfig(data.config, resolvedParamsConfig);
  }, [data, isLoading, resolvedParamsConfig]);

  return resolvedConfig;
}
