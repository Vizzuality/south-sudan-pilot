import { MVTLayerProps } from "@deck.gl/geo-layers";
import { binaryToGeojson } from "@loaders.gl/gis";
import { BinaryFeatureCollection } from "@loaders.gl/schema";
import { featureCollection, point } from "@turf/helpers";
import { coordAll } from "@turf/meta";
import { GeoJsonProperties } from "geojson";
import { DataDrivenPropertyValueSpecification } from "mapbox-gl";
import {
  expression as mapboxExpression,
  StylePropertySpecification,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
} from "mapbox-gl/dist/style-spec/index.cjs";

import { env } from "@/env";
import { LayerConfig } from "@/types/layer";

const resolveMapboxExpression = (
  expression: unknown,
  zoom: number,
  geometry: Parameters<(typeof mapboxExpression)["StyleExpression"]["prototype"]["evaluate"]>[1],
  expectedType?: StylePropertySpecification["type"],
) => {
  const { result, value } = mapboxExpression.createExpression(
    expression,
    expectedType
      ? ({
          type: expectedType,
        } as StylePropertySpecification)
      : undefined,
  );

  if (result === "success") {
    const res = value.evaluate({ zoom }, geometry);

    if (expectedType === "color") {
      return [res.r * 255, res.g * 255, res.b * 255, res.a * 255];
    }

    return res;
  }

  console.warn(`Unsupported expression: ${expression}. Expression not resolved.`);

  return null;
};

const resolveVisible = (style: LayerConfig["styles"][0]) => {
  return style.layout?.visibility !== "none";
};

const resolveOpacity = (style: LayerConfig["styles"][0], zoom: number, defaultValue = 1) => {
  let value: DataDrivenPropertyValueSpecification<number> | undefined;

  if (style.type === "fill") {
    value = style.paint?.["fill-opacity"] as number;
  } else if (style.type === "circle") {
    value = style.paint?.["circle-opacity"] as number;
  } else if (style.type === "line") {
    value = style.paint?.["line-opacity"] as number;
  } else if (style.type === "symbol") {
    value = style.paint?.["icon-opacity"] as number;
  }

  if (value === undefined) {
    return defaultValue;
  }

  const resolvedValue = resolveMapboxExpression(value, zoom, undefined, "number");

  if (resolvedValue === null || resolvedValue === undefined) {
    return defaultValue;
  }

  return resolvedValue;
};

const resolveFillColor = (
  style: LayerConfig["styles"][0],
  zoom: number,
  defaultValue = [0, 0, 0],
) => {
  let value: DataDrivenPropertyValueSpecification<string> | undefined;

  if (style.type === "fill") {
    value = style.paint?.["fill-color"];
  } else if (style.type === "circle") {
    value = style.paint?.["circle-color"];
  } else {
    return undefined;
  }

  if (value === undefined) {
    return defaultValue;
  }

  return ((feature) => {
    const resolvedValue = resolveMapboxExpression(value, zoom, feature, "color");

    if (resolvedValue === null || resolvedValue === undefined) {
      return defaultValue;
    }

    return resolvedValue;
  }) as MVTLayerProps["getFillColor"];
};

const resolvePointRadius = (style: LayerConfig["styles"][0], zoom: number, defaultValue = 5) => {
  let value: DataDrivenPropertyValueSpecification<number> | undefined;

  if (style.type === "circle") {
    value = style.paint?.["circle-radius"];
  } else {
    return undefined;
  }

  if (value === undefined) {
    return defaultValue;
  }

  return ((feature) => {
    const resolvedValue = resolveMapboxExpression(value, zoom, feature, "number");

    if (resolvedValue === null || resolvedValue === undefined) {
      return defaultValue;
    }

    return resolvedValue;
  }) as MVTLayerProps["getPointRadius"];
};

const resolveLineColor = (
  style: LayerConfig["styles"][0],
  zoom: number,
  defaultValue = [0, 0, 0],
) => {
  let value: DataDrivenPropertyValueSpecification<string> | undefined;

  if (style.type === "circle") {
    value = style.paint?.["circle-stroke-color"];
  } else if (style.type === "line") {
    value = style.paint?.["line-color"];
  } else {
    return undefined;
  }

  if (value === undefined) {
    return style.type === "line" ? defaultValue : undefined;
  }

  return ((feature) => {
    const resolvedValue = resolveMapboxExpression(value, zoom, feature, "color");

    if (resolvedValue === null || resolvedValue === undefined) {
      return defaultValue;
    }

    return resolvedValue;
  }) as MVTLayerProps["getLineColor"];
};

const resolveLineWidth = (style: LayerConfig["styles"][0], zoom: number, defaultValue = 2) => {
  let value: DataDrivenPropertyValueSpecification<number> | undefined;

  if (style.type === "circle") {
    value = style.paint?.["circle-stroke-width"];
  } else if (style.type === "line") {
    value = style.paint?.["line-width"];
  } else {
    return undefined;
  }

  if (value === undefined) {
    return style.type === "line" ? defaultValue : undefined;
  }

  return ((feature) => {
    const resolvedValue = resolveMapboxExpression(value, zoom, feature, "number");

    if (resolvedValue === null || resolvedValue === undefined) {
      return defaultValue;
    }

    return resolvedValue;
  }) as MVTLayerProps["getLineWidth"];
};

const resolveIcon = (style: LayerConfig["styles"][0], zoom: number, defaultValue = undefined) => {
  let value: DataDrivenPropertyValueSpecification<string> | undefined;

  if (style.type === "symbol") {
    value = style.layout?.["icon-image"];
  } else {
    return undefined;
  }

  if (value === undefined) {
    return defaultValue;
  }

  return ((feature) => {
    const resolvedValue = resolveMapboxExpression(value, zoom, feature, "string");

    if (resolvedValue === null || resolvedValue === undefined) {
      return defaultValue;
    }

    return resolvedValue;
    // NOTE: intentionally wrong as `MVTLayerProps["getIcon"]` return type any
  }) as MVTLayerProps["getFillColor"];
};

const resolveIconSizeScale = (
  style: LayerConfig["styles"][0],
  zoom: number,
  defaultValue = undefined,
) => {
  let value: DataDrivenPropertyValueSpecification<number> | undefined;

  if (style.type === "symbol") {
    value = style.layout?.["icon-size"];
  } else {
    return undefined;
  }

  if (value === undefined) {
    return defaultValue;
  }

  const resolvedValue = resolveMapboxExpression(value, zoom, undefined, "number");

  if (resolvedValue === null || resolvedValue === undefined) {
    return defaultValue;
  }

  return resolvedValue;
};

export const resolveInteractive = (
  style: LayerConfig["styles"][0],
  zoom: number,
  feature: GeoJsonProperties,
  defaultValue = false,
) => {
  let value: DataDrivenPropertyValueSpecification<boolean> | undefined;

  if (
    style.type === "fill" ||
    style.type === "circle" ||
    style.type === "line" ||
    style.type === "symbol"
  ) {
    // NOTE: this property is custom, that's why we need to disable the error
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    value = style.layout?.["interactive"];
  } else {
    return undefined;
  }

  if (value === undefined) {
    return defaultValue;
  }

  const resolvedValue = resolveMapboxExpression(value, zoom, feature, "boolean");

  if (resolvedValue === null || resolvedValue === undefined) {
    return defaultValue;
  }

  return resolvedValue;
};

export const resolveDeckglProperties = (style: LayerConfig["styles"][0], zoom: number) => {
  const resolvedProperties = {
    visible: resolveVisible(style),
    opacity: resolveOpacity(style, zoom),
    getFillColor: resolveFillColor(style, zoom) as MVTLayerProps["getFillColor"],
    getPointRadius: resolvePointRadius(style, zoom),
    getLineColor: resolveLineColor(style, zoom) as MVTLayerProps["getLineColor"],
    getLineWidth: resolveLineWidth(style, zoom),
    getIcon: resolveIcon(style, zoom),
    getIconSize: 36,
    iconSizeScale: resolveIconSizeScale(style, zoom),
    pointType: style.type === "symbol" ? "icon" : "circle",
    pointRadiusUnits: "pixels" as const,
    lineWidthUnits: "pixels" as const,
    iconSizeUnits: "pixels" as const,
    iconAtlas: `https://api.mapbox.com/styles/v1/${env.NEXT_PUBLIC_MAPBOX_STYLE.split("mapbox://styles/")[1]}/sprite.png?access_token=${env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
    iconMapping: `https://api.mapbox.com/styles/v1/${env.NEXT_PUBLIC_MAPBOX_STYLE.split("mapbox://styles/")[1]}/sprite.json?access_token=${env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
    filled: true,
    stroked: true,
  };

  // If the layer doesn't have any fill color, we make sure to not fill with anything
  if (!resolvedProperties.getFillColor) {
    resolvedProperties.filled = false;
  }

  // If the layer doesn't have any stroke width, we make sure to hide the stroke
  if (!resolvedProperties.getLineWidth) {
    resolvedProperties.stroked = false;
  }

  return Object.entries(resolvedProperties).reduce(
    (res, [key, value]) => {
      if (value === undefined) {
        return res;
      }

      return {
        ...res,
        [key]: value,
        updateTriggers: {
          ...res["updateTriggers"],
          [key]: [style],
        },
      };
    },
    { updateTriggers: {} },
  ) as Partial<typeof resolvedProperties>;
};

export const convertBinaryToPointGeoJSON = (data: BinaryFeatureCollection) => {
  const featureOrFeatures = binaryToGeojson(data as BinaryFeatureCollection);
  const features = Array.isArray(featureOrFeatures) ? featureOrFeatures : [featureOrFeatures];
  const points = features.flatMap((feature) =>
    coordAll(feature).map((coords) => point(coords, feature.properties)),
  );
  return featureCollection(points);
};
