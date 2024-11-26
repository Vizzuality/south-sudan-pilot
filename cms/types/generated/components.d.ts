import type { Schema, Attribute } from '@strapi/strapi';

export interface LegendLegendConfig extends Schema.Component {
  collectionName: 'components_legend_legend_configs';
  info: {
    displayName: 'config';
    description: '';
  };
  attributes: {
    type: Attribute.Enumeration<['basic', 'choropleth', 'gradient', 'scale']> &
      Attribute.Required;
    items: Attribute.Component<'legend.items', true>;
    unit: Attribute.String;
  };
}

export interface LegendItems extends Schema.Component {
  collectionName: 'components_legend_item_items';
  info: {
    displayName: 'item';
    description: '';
  };
  attributes: {
    color: Attribute.String & Attribute.Required;
    value: Attribute.String;
    pattern: Attribute.String;
    size: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    group: Attribute.String;
  };
}

export interface MetadataItem extends Schema.Component {
  collectionName: 'components_metadata_item';
  info: {
    displayName: 'Item';
    description: '';
  };
  attributes: {
    source: Attribute.String;
    website: Attribute.String;
    description: Attribute.Text;
    main_applications: Attribute.RichText;
    temporal_coverage: Attribute.RichText;
    spatial_resolution: Attribute.String;
    units: Attribute.String;
    full_name: Attribute.String & Attribute.Required;
    temporal_resolution: Attribute.RichText;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'legend.legend-config': LegendLegendConfig;
      'legend.items': LegendItems;
      'metadata.item': MetadataItem;
    }
  }
}
