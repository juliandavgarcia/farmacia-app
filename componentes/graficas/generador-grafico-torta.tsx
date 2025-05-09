"use client";

import { Pie, PieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/componentes/ui/chart";

type ChartPieConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

interface PieChartGeneratorProps<T> {
  data: T[];
  series: ChartPieConfig;
  title?: string;
  description?: string;
  footerNote?: string;
}

export function PieChartGenerator<T>({
  data,
  series,
  title = "Pie Chart",
  description = "",
}: PieChartGeneratorProps<T>) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={series}
          className="mx-auto aspect-square max-h-[400px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" nameKey="name" label>
              {Object.keys(series).map((key) => (
                <Cell key={key} fill={series[key].color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
