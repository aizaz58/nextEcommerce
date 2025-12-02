"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { OrderCountItem } from "@/lib/types/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueChartProps {
  items?: OrderCountItem[];
}

export default function RevenueChart({ items }: RevenueChartProps) {
  const safeItems = Array.isArray(items) ? items : [];
  const data = {
    labels: safeItems.map((item) => item?.date),
    datasets: [
      {
        label: "Revenue",
        data: safeItems.map((item) => (item?.data?.totalRevenue ?? 0) / 100),
        backgroundColor: "#879fff20",
        borderColor: "#111827",
        borderWidth: 1,
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
        text: "Revenue Line Chart",
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
    <section className="bg-card text-foreground p-5 rounded-xl shadow w-full h-[430px] min-w-0">
      <div className="w-full h-full min-w-0">
        <Line data={data} options={options} />
      </div>
    </section>
  );
}
