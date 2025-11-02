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

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function RevenueChart({ items }) {
  const data = {
    labels: items?.map((item) => item?.date),
    datasets: [
      {
        label: "Revenue",
        data: items?.map((item) => (item?.data?.totalRevenue ?? 0) / 100),
        backgroundColor: "#879fff20",
        borderColor: "text-foreground",
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
        position: "top",
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
