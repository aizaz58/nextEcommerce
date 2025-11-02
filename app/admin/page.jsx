"use client"

import { useOrdersCountsByTotalDays } from "@/lib/firestore/orders/read_count"
import CountMeter from "./components/CountMeter"
import OrdersChart from "./components/OrdersChart"
import RevenueChart from "./components/RevenueChart"
import { useEffect, useState } from "react"

export default function Page() {
  const [dates, setDates] = useState([])

  useEffect(() => {
    let list = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i)
      list.push(date)
    }
    setDates(list)
  }, [])

  const { data } = useOrdersCountsByTotalDays({ dates: dates })

  return (
    <main className="flex flex-col gap-6 mx-3 pt-15  md:pt-0">
      <h1 className="text-xl">DashBoard</h1>
      <CountMeter />
      <div className="flex flex-col md:flex-row gap-5 min-w-0">
        <div className="flex-1 min-w-0">
          <RevenueChart items={data} />
        </div>
        <div className="flex-1 min-w-0">
          <OrdersChart items={data} />
        </div>
      </div>
    </main>
  )
}
