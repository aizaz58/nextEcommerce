"use client"

import { useOrdersCountsByTotalDays } from "@/lib/firestore/orders/read_count"
import CountMeter from "./CountMeter"
import OrdersChart from "./OrdersChart"
import RevenueChart from "./RevenueChart"
import { useEffect, useState } from "react"

export  function DashboardContent() {
  const [dates, setDates] = useState<Date[]>([])

  useEffect(() => {
    const list: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i)
      list.push(date)
    }
    setDates(list)
  }, [])

  const { data } = useOrdersCountsByTotalDays({ dates: dates })

  return (
    <>
      <CountMeter />
      <div className="flex flex-col md:flex-row gap-5 min-w-0">
        <div className="flex-1 min-w-0">
          <RevenueChart items={data} />
        </div>
        <div className="flex-1 min-w-0">
          <OrdersChart items={data} />
        </div>
      </div>
    </>
  )
}




