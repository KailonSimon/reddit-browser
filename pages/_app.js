import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

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
      <NotificationsProvider>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default MyApp;
