"use client";

import { useOrdersCountsByTotalDays } from "@/lib/firestore/orders/read_count";
import CountMeter from "./CountMeter";
import OrdersChart from "./OrdersChart";
import RevenueChart from "./RevenueChart";
import { useEffect, useState, useMemo } from "react";
import { OrderCountItem } from "@/lib/types/types";

export function DashboardContent() {
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    const list: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      list.push(date);
    }
    setDates(list);
  }, []);

  const { data } = useOrdersCountsByTotalDays({ dates });

  // Convert Firestore aggregate data to OrderCountItem format
  const chartData: OrderCountItem[] | undefined = useMemo(() => {
    if (!Array.isArray(data)) return undefined;

    return data
      .filter(
        (item): item is { date: string; data: any } =>
          item !== null &&
          typeof item === "object" &&
          "date" in item &&
          "data" in item &&
          typeof item.date === "string"
      )
      .map((item) => ({
        date: item.date,
        data: {
          totalRevenue:
            typeof item.data?.totalRevenue === "number"
              ? item.data.totalRevenue
              : typeof item.data?.totalRevenue === "object" &&
                  "value" in item.data.totalRevenue
              ? item.data.totalRevenue.value
              : undefined,
          totalOrders:
            typeof item.data?.totalOrders === "number"
              ? item.data.totalOrders
              : typeof item.data?.totalOrders === "object" &&
                  "value" in item.data.totalOrders
              ? item.data.totalOrders.value
              : undefined,
        },
      }));
  }, [data]);

  return (
    <>
      <CountMeter />
      <div className="flex flex-col md:flex-row gap-5 min-w-0">
        <div className="flex-1 min-w-0">
          <RevenueChart items={chartData} />
        </div>
        <div className="flex-1 min-w-0">
          <OrdersChart items={chartData} />
        </div>
      </div>
    </>
  );
}




