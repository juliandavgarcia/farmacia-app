"use client";

import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/componentes/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/componentes/ui/chart";

type ChartBarConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

interface BarChartGeneratorProps<T> {
  data: T[];
  xAxisKey: keyof T;
  series: ChartBarConfig;
  title?: string;
  description?: string;
  footerNote?: string;
}

export function BarChartGenerator<T>({
  data,
  xAxisKey,
  series,
  title = "Bar Chart",
  description = "",
}: BarChartGeneratorProps<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={series}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxisKey as string}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {Object.keys(series).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={series[key].color}
                radius={4}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
