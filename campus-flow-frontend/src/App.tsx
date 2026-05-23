import { AppRoutes } from "@/routes/Router"
import { ThemeProvider } from "./core/components/providers/ThemeProvider"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App