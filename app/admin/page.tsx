import {DashboardContent} from "./components/DashboardContent"

export default function Page() {
  return (
    <main className="flex flex-col gap-6 mx-3 pt-15  md:pt-0">
      <h1 className="text-xl">DashBoard</h1>
      <DashboardContent />
    </main>
  )
}
