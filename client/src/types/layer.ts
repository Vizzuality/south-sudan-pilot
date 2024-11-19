import {
  CircleLayerSpecification,
  FillLayerSpecification,
  LineLayerSpecification,
  RasterLayerSpecification,
  SymbolLayerSpecification,
} from "mapbox-gl";
import { AnySource } from "react-map-gl";

export interface LayerSettings {
  visibility: boolean;
  opacity: number;
  "return-period"?: number;
  date?: string;
}

export interface LayerConfig {
  source: AnySource;
  styles: (
    | FillLayerSpecification
    | CircleLayerSpecification
    | LineLayerSpecification
    | SymbolLayerSpecification
    | RasterLayerSpecification
  )[];
}

export interface LayerParamsConfigValue {
  key: string;
  default: unknown;
  options?: unknown[];
}

export type LayerParamsConfig = LayerParamsConfigValue[];

export interface LayerResolvedParamsConfig {
  [key: string]: unknown;
}
