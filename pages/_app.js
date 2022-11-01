import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { theme } from "../theme";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const queryClient = new QueryClient();
  return (
    <SessionProvider session={session}>
      <MantineProvider theme={theme}>
        <NotificationsProvider>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
        </NotificationsProvider>
      </MantineProvider>
    </SessionProvider>
  );
}

export default MyApp;
