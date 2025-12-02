"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { OrderCountItem } from "@/lib/types/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface OrdersChartProps {
  items?: OrderCountItem[];
}

export default function OrdersChart({ items }: OrdersChartProps) {
  const safeItems = Array.isArray(items) ? items : [];
  const data = {
    labels: safeItems.map((item) => item?.date),
    datasets: [
      {
        label: "Orders",
        data: safeItems.map((item) => item?.data?.totalOrders ?? 0),
        backgroundColor: "rgba(135, 159, 255, 0.35)",
        borderColor: "#111827",
        borderWidth: 2,
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Total Order Bar Chart",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <section className="bg-card p-5 rounded-xl shadow w-full h-[430px] min-w-0">
      <div className="w-full h-full min-w-0">
        <Bar data={data} options={options} />
      </div>
    </section>
  );
}
