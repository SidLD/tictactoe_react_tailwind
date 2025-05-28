import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import Loading from "@/lib/loading"
import { PrivateLayout, PublicLayout } from "@/module/module"

const HomePage = lazy(() => import("@/pages/home/index"))
const TicTacToeBoard = lazy(() => import("@/pages/game/index"))
const routers = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <HomePage />
            </Suspense>
          }
        />
      </Route>
        <Route element={<PrivateLayout />}>
        <Route
          path="/game"
          element={
            <Suspense fallback={<Loading />}>
              <TicTacToeBoard />
            </Suspense>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />

    </>,
  ),
)

export default routers
