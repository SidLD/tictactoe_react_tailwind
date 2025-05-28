import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import Loading from "@/lib/loading"
import GuestLayout from "@/layout/guest.layout"

const HomePage = lazy(() => import("@/pages/home/index"))
const routers = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<GuestLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <HomePage />
            </Suspense>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />

    </>,
  ),
)

export default routers
