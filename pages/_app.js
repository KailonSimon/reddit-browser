import "../styles/globals.css";
import {
  useInfiniteQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient();
  return (
    <MantineProvider
      theme={{
        colorScheme: "dark",
        fontFamily: "Chillax, sans-serif",
        colors: {
          brand: [
            "#59ba12ff",
            "#59ba12ff",
            "#59ba12ff",
            "#59ba12ff",
            "#59ba12ff",
            "#59ba12ff",
            "#59ba12ff",
            "#59ba12ff",
            "#59ba12ff",
            "#59ba12ff",
          ],
          accent: [
            "#7312ba",
            "#7312ba",
            "#7312ba",
            "#7312ba",
            "#7312ba",
            "#7312ba",
            "#7312ba",
            "#7312ba",
            "#7312ba",
            "#7312ba",
          ],
        },
        primaryColor: "brand",
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default MyApp;
