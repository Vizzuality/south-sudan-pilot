"use client";

import { AxisBottom, AxisLeft, AxisTop } from "@visx/axis";
import { LinearGradient } from "@visx/gradient";
import { GridColumns, GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { useParentSize } from "@visx/responsive";
import { scaleLinear, scalePoint } from "@visx/scale";
import { AreaClosed, Line, LinePath } from "@visx/shape";
import { Text, TextProps } from "@visx/text";
import { extent } from "d3-array";
import { interpolateRgb, piecewise } from "d3-interpolate";
import { format } from "date-fns/format";
import { uniqueId } from "lodash-es";
import { ComponentProps, useCallback, useMemo } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import useYearChartData from "@/hooks/use-year-chart-data";
import tailwindConfig from "@/lib/tailwind-config";
import { cn } from "@/lib/utils";

interface YearChartProps {
  data: ReturnType<typeof useYearChartData>["data"];
  date: string;
  loading: boolean;
  active: boolean;
}

const CHART_MIN_HEIGHT = 120;
const CHART_MAX_HEIGHT = 250;
const X_AXIS_HEIGHT = 22;
const X_AXIS_OFFSET_RIGHT = 5;
const X_AXIS_TICK_HEIGHT = 5;
const Y_AXIS_WIDTH = 34;
const Y_AXIS_OFFSET_TOP = 5;
const Y_AXIS_TICK_WIDTH = 5;
const Y_AXIS_TICK_COUNT = 5;
const GRADIENT_OPACITY_EXTENT = [0.9, 0.7];

const YearChart = ({ data, date, loading, active }: YearChartProps) => {
  const { parentRef, width } = useParentSize({ ignoreDimensions: ["height"] });
  const height = useMemo(
    () => Math.max(Math.min(width / 2.7, CHART_MAX_HEIGHT), CHART_MIN_HEIGHT),
    [width],
  );

  const unitWidth = useMemo(() => {
    if (loading || !data) {
      return 0;
    }

    const subtract =
      data.unit?.split("").reduce((res, char) => {
        if (char === "˚" || char === "/" || char === " ") {
          return res - 6;
        }

        return res;
      }, Y_AXIS_TICK_WIDTH) ?? Y_AXIS_TICK_WIDTH;

    return (data.unit?.length ?? 0) * 8 + subtract;
  }, [data, loading]);

  const xScale = useMemo(() => {
    if (loading || !data) {
      return undefined;
    }

    return scalePoint({
      range: [0, width - Y_AXIS_WIDTH - X_AXIS_OFFSET_RIGHT - unitWidth],
      domain: data.data.map(({ x }) => x),
    });
  }, [width, data, loading, unitWidth]);

  const yScale = useMemo(() => {
    if (loading || !data) {
      return undefined;
    }

    return scaleLinear({
      range: [height - X_AXIS_HEIGHT, Y_AXIS_OFFSET_TOP],
      domain: extent(data.data.map(({ y }) => y)) as [number, number],
      nice: Y_AXIS_TICK_COUNT,
    });
  }, [height, data, loading]);

  const fillColorScale = useMemo(() => {
    if (loading || !data) {
      return undefined;
    }

    return scaleLinear({
      range: data.colorRange,
      domain: data.colorDomain,
    }).interpolate(() => piecewise(interpolateRgb, data.colorRange));
  }, [data, loading]);

  const xAxisTickLabelProps = useCallback<
    NonNullable<Exclude<ComponentProps<typeof AxisBottom>["tickLabelProps"], Partial<TextProps>>>
  >((tick, index, ticks) => {
    let textAnchor: ComponentProps<typeof Text>["textAnchor"] = "middle";
    let dx = 0;
    if (index === 0) {
      textAnchor = "start";
    } else if (index + 1 === ticks.length) {
      textAnchor = "end";
      dx = X_AXIS_OFFSET_RIGHT;
    }

    return {
      dx,
      dy: 3.5,
      textAnchor,
      className: cn({
        "text-right font-sans text-[11px] text-rhino-blue-950": true,
        "invisible sm:visible": index % 2 === 1,
      }),
    };
  }, []);

  const yAxisTickLabelProps = useCallback<
    NonNullable<Exclude<ComponentProps<typeof AxisLeft>["tickLabelProps"], Partial<TextProps>>>
  >((tick, index) => {
    let dy = 3.5;
    if (index === 0) {
      dy = 0;
    }

    return {
      dx: -4,
      dy,
      textAnchor: "end",
      className: "text-right font-sans text-[11px] text-rhino-blue-950",
    };
  }, []);

  const gradientId = useMemo(() => uniqueId(), []);

  const gradientColorStops = useMemo(() => {
    if (!fillColorScale || !yScale) {
      return [];
    }

    const yScaleDomainReversed = yScale.domain().reverse();

    return fillColorScale.range().map((color, index) => {
      const normalizedIndex = index / (fillColorScale.range().length - 1);

      const stopValue =
        yScaleDomainReversed[0] +
        normalizedIndex * (yScaleDomainReversed[1] - yScaleDomainReversed[0]);

      const stopOpacity =
        GRADIENT_OPACITY_EXTENT[0] -
        normalizedIndex * (GRADIENT_OPACITY_EXTENT[0] - GRADIENT_OPACITY_EXTENT[1]);

      return {
        offset: `${normalizedIndex * 100}%`,
        stopColor: fillColorScale(stopValue),
        stopOpacity,
      };
    });
  }, [fillColorScale, yScale]);

  return (
    <div ref={parentRef}>
      {loading && !data && <Skeleton style={{ width: `${width}px`, height: `${height}px` }} />}
      {!loading && !!data && !!xScale && !!yScale && !!fillColorScale && (
        <svg
          width={width}
          height={height}
          className={cn({
            "transition-all duration-500": true,
            grayscale: !active,
            "grayscale-0": active,
          })}
        >
          <LinearGradient id={`year-chart-gradient-${gradientId}`}>
            {gradientColorStops.map((stop, index) => (
              <stop key={index} {...stop} />
            ))}
          </LinearGradient>
          <Group left={Y_AXIS_WIDTH}>
            <GridRows
              width={width - Y_AXIS_WIDTH - unitWidth}
              height={height - X_AXIS_HEIGHT - Y_AXIS_OFFSET_TOP}
              scale={yScale}
              numTicks={Y_AXIS_TICK_COUNT}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              stroke={tailwindConfig.theme.colors["casper-blue"]["400"]}
              strokeOpacity={0.5}
            />
            <GridColumns
              top={Y_AXIS_OFFSET_TOP}
              width={width - X_AXIS_OFFSET_RIGHT - unitWidth}
              height={height - X_AXIS_HEIGHT - Y_AXIS_OFFSET_TOP}
              scale={xScale}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              stroke={tailwindConfig.theme.colors["casper-blue"]["400"]}
              strokeOpacity={0.5}
            />
            <AreaClosed<(typeof data.data)[0]>
              data={data.data}
              x={(d) => xScale(d.x) ?? 0}
              y={(d) => yScale(d.y) ?? 0}
              yScale={yScale}
              fill={`url('#year-chart-gradient-${gradientId}')`}
            />
            <LinePath
              data={data.data}
              x={(d) => xScale(d.x) ?? 0}
              y={(d) => yScale(d.y) ?? 0}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              stroke={data.colorRange.slice(-1)[0]}
              strokeWidth={1}
            />
          </Group>
          <AxisLeft
            scale={yScale}
            left={Y_AXIS_WIDTH}
            tickLength={Y_AXIS_TICK_WIDTH}
            numTicks={Y_AXIS_TICK_COUNT}
            tickClassName="[&>line]:stroke-casper-blue-400/50"
            tickLabelProps={yAxisTickLabelProps}
            axisLineClassName="opacity-0"
          />
          <Group left={Y_AXIS_WIDTH}>
            {/* This axis serves to extend the grid vertically towards the top */}
            <AxisTop
              scale={xScale}
              top={Y_AXIS_OFFSET_TOP}
              tickLength={Y_AXIS_OFFSET_TOP}
              tickComponent={() => null}
              tickLabelProps={xAxisTickLabelProps}
              tickClassName="[&>line]:stroke-casper-blue-400/50"
              axisLineClassName="opacity-0"
            />
            <AxisBottom
              scale={xScale}
              top={height - X_AXIS_HEIGHT}
              tickLength={X_AXIS_TICK_HEIGHT}
              tickLabelProps={xAxisTickLabelProps}
              tickClassName="[&>line]:stroke-casper-blue-400/50"
              axisLineClassName="stroke-casper-blue-400/50"
            />
            <Line
              from={{ x: xScale(format(date, "MMM")), y: yScale.range()[1] - Y_AXIS_OFFSET_TOP }}
              to={{ x: xScale(format(date, "MMM")), y: yScale.range()[0] + X_AXIS_TICK_HEIGHT }}
              className={cn({
                "stroke-supernova-yellow-400 stroke-2 transition-opacity duration-500": true,
                "opacity-0": !active,
                "opacity-100": active,
              })}
            />
          </Group>
          <Text
            x={width}
            y={Y_AXIS_OFFSET_TOP}
            dy={5}
            textAnchor="end"
            className="text-right font-sans text-[11px] text-rhino-blue-950"
          >
            {data.unit}
          </Text>
        </svg>
      )}
    </div>
  );
};

export default YearChart;
