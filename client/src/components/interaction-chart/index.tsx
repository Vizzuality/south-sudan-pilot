"use client";

import { AxisBottom, AxisLeft, AxisTop } from "@visx/axis";
import { GlyphCircle } from "@visx/glyph";
import { GridColumns, GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { useParentSize } from "@visx/responsive";
import { scaleLinear, scaleTime } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { Text, TextProps } from "@visx/text";
import { extent } from "d3-array";
import { ComponentProps, useCallback, useMemo } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import useInteractionChartData from "@/hooks/use-interaction-chart-data";
import tailwindConfig from "@/lib/tailwind-config";
import { cn } from "@/lib/utils";

interface InteractionChartProps {
  data: ReturnType<typeof useInteractionChartData>["data"];
  loading: boolean;
}

const CHART_MIN_HEIGHT = 120;
const CHART_MAX_HEIGHT = 270;
const X_AXIS_HEIGHT = 22;
const X_AXIS_OFFSET_RIGHT = 5;
const X_AXIS_TICK_COUNT = 5;
const X_AXIS_TICK_HEIGHT = 5;
const Y_AXIS_WIDTH = 40;
const Y_AXIS_OFFSET_TOP = 20;
const Y_AXIS_TICK_WIDTH = 5;
const Y_AXIS_TICK_COUNT = 5;

const InteractionChart = ({ data, loading }: InteractionChartProps) => {
  const { parentRef, width } = useParentSize({ ignoreDimensions: ["height"] });
  const height = useMemo(
    () => Math.max(Math.min(width / 2.35, CHART_MAX_HEIGHT), CHART_MIN_HEIGHT),
    [width],
  );

  const xScale = useMemo(() => {
    if (loading || !data) {
      return undefined;
    }

    const xValues = data.data.map(({ x }) => x).sort();

    return scaleTime({
      range: [0, width - Y_AXIS_WIDTH - X_AXIS_OFFSET_RIGHT],
      domain: [new Date(xValues[0]), new Date(xValues.slice(-1)[0])],
      nice: X_AXIS_TICK_COUNT,
    });
  }, [width, data, loading]);

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

  return (
    <div ref={parentRef}>
      {loading && !data && <Skeleton style={{ width: `${width}px`, height: `${height}px` }} />}
      {!loading && !!data && !!xScale && !!yScale && (
        <svg width={width} height={height}>
          <Group left={Y_AXIS_WIDTH}>
            <GridRows
              width={width - Y_AXIS_WIDTH}
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
              width={width - X_AXIS_OFFSET_RIGHT}
              height={height - X_AXIS_HEIGHT - Y_AXIS_OFFSET_TOP}
              scale={xScale}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              stroke={tailwindConfig.theme.colors["casper-blue"]["400"]}
              strokeOpacity={0.5}
              numTicks={X_AXIS_TICK_COUNT}
            />
            <LinePath
              data={data.data}
              x={(d) => xScale(new Date(d.x)) ?? 0}
              y={(d) => yScale(d.y) ?? 0}
              defined={(d) => d.y !== null}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              strokeWidth={1}
              className="stroke-supernova-yellow-600/30"
            />
            {data.data.map((d) => {
              if (d.y === null) {
                return null;
              }

              const top = yScale(d.y) ?? 0;
              const left = xScale(new Date(d.x)) ?? 0;

              return (
                <GlyphCircle
                  key={`${d.x}-${d.y}`}
                  top={top}
                  left={left}
                  size={2}
                  className="fill-supernova-yellow-600"
                />
              );
            })}
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
              numTicks={X_AXIS_TICK_COUNT}
              tickLength={X_AXIS_TICK_HEIGHT}
              tickComponent={() => null}
              tickLabelProps={xAxisTickLabelProps}
              tickClassName="[&>line]:stroke-casper-blue-400/50"
              axisLineClassName="opacity-0"
            />
            <AxisBottom
              scale={xScale}
              top={height - X_AXIS_HEIGHT}
              numTicks={X_AXIS_TICK_COUNT}
              tickLength={X_AXIS_TICK_HEIGHT}
              tickLabelProps={xAxisTickLabelProps}
              tickClassName="[&>line]:stroke-casper-blue-400/50"
              axisLineClassName="stroke-casper-blue-400/50"
            />
          </Group>
          <Text
            x={width}
            y={0}
            dy={10}
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

export default InteractionChart;
