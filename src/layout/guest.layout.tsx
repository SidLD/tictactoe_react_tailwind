import { Outlet } from "react-router-dom"

export default function GuestLayout() {
  return (
    <main className="w-screen min-h-screen ">
      <Outlet />
    </main>
  )
}
