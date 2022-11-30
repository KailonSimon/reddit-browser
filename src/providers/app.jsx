import { useState, Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { theme } from "../../theme";
import PostModal from "../components/Post/PostModal";
import { Provider } from "react-redux";
import { queryClient } from "../lib/react-query";
import LoadingScreen from "../components/LoadingScreen";
import Auth from "./auth";

export const AppProvider = ({ children, reduxProps, reduxStore }) => {
  const [colorScheme, setColorScheme] = useState("dark");
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Provider store={reduxStore}>
        <SessionProvider session={reduxProps.pageProps.session}>
          <Auth>
            <QueryClientProvider client={queryClient}>
              <Hydrate state={reduxProps.pageProps.dehydratedState}>
                <ColorSchemeProvider
                  colorScheme={colorScheme}
                  toggleColorScheme={toggleColorScheme}
                >
                  <MantineProvider theme={{ ...theme }}>
                    <ModalsProvider
                      modals={{
                        post: PostModal,
                      }}
                    >
                      <NotificationsProvider>{children}</NotificationsProvider>
                    </ModalsProvider>
                  </MantineProvider>
                </ColorSchemeProvider>
              </Hydrate>
            </QueryClientProvider>
          </Auth>
        </SessionProvider>
      </Provider>
    </Suspense>
  );
};
