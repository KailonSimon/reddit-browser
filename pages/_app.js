import "../styles/globals.css";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { theme } from "../theme";
import { useLocalStorage } from "@mantine/hooks";
import PostModal from "../src/components/PostModal";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [queryClient] = useState(() => new QueryClient());
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "color-scheme",
    defaultValue: "dark",
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          >
            <MantineProvider theme={{ ...theme, colorScheme }}>
              <ModalsProvider modals={{ post: PostModal }}>
                <NotificationsProvider>
                  <Component {...pageProps} />
                </NotificationsProvider>
              </ModalsProvider>
            </MantineProvider>
          </ColorSchemeProvider>
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
