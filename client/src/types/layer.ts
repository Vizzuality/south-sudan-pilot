import { AnyLayer, AnySource, SkyLayer } from "react-map-gl";

export interface LayerSettings {
  visibility: boolean;
  opacity: number;
}

export interface LayerConfig {
  source: AnySource;
  styles: Exclude<AnyLayer, SkyLayer>[];
}

export interface LayerParamsConfigValue {
  key: string;
  default: unknown;
}

export type LayerParamsConfig = LayerParamsConfigValue[];

export interface LayerResolvedParamsConfig {
  [key: string]: unknown;
}
