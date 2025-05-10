"use client";
import { totalOrders } from "@/lib/infer-type";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { weeklyChart } from "./weeklyChart";
import { monthlyChart } from "./monthlyChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import formatPrice from "@/lib/formatPrice";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function Revenue({
  totalOrders,
}: {
  totalOrders: totalOrders[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  //getthing the filter from the url
  const filter = searchParams.get("filter") || "weekly";

  //extracting only date and total from the totalOrders
  const chartItems = totalOrders.map((order) => ({
    date: order.order.created!,
    total: order.order.total,
  }));

  const activeChart = useMemo(() => {
    if (filter === "weekly") {
      return weeklyChart(chartItems);
    }
    return monthlyChart(chartItems);
  }, [filter]);

  const activeTotal = useMemo(() => {
    if (filter == "weekly") {
      return weeklyChart(chartItems).reduce(
        (acc, order) => acc + order.revenue,
        0
      );
    }
    return monthlyChart(chartItems).reduce(
      (acc, order) => acc + order.revenue,
      0
    );
  }, [filter]);

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex-1 shrink-0 h-full">
      <CardHeader>
        <CardTitle>Your Revenue : {formatPrice(activeTotal)}</CardTitle>
        <CardDescription>Here are your recent earnings</CardDescription>

        <div className="flex gap-2 items-center pb-4">
          <Badge
            className={cn(
              "cursor-pointer",
              filter === "weekly" ? "bg-primary" : "bg-primary/25"
            )}
            onClick={() =>
              router.push("/dashboard/analytics/?filter=weekly", {
                scroll: false,
              })
            }
          >
            This Week
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer",
              filter !== "weekly" ? "bg-primary" : "bg-primary/25"
            )}
            onClick={() =>
              router.push("/dashboard/analytics/?filter=monthly", {
                scroll: false,
              })
            }
          >
            This Month
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={activeChart}>
            <CartesianGrid />
            <XAxis dataKey="date" tickLine={false} tickMargin={10} />
            <YAxis dataKey="revenue" tickLine={false} tickMargin={10} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4}></Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
