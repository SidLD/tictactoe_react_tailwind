import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import routers from "./module/router";
import './index.css'
import { Toaster } from "./components/ui/sonner";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <RouterProvider
        router={routers}
      />
    </QueryClientProvider>
  );
}

export default App;
