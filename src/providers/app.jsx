import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import PostModal from "src/components/Post/PostModal";
import LoadingScreen from "src/components/LoadingScreen";
import { theme } from "src/styles/theme";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { queryClient } from "src/lib/react-query";
import Auth from "./auth";

export const AppProvider = ({ children, reduxProps, reduxStore }) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Provider store={reduxStore}>
        <SessionProvider session={reduxProps.pageProps.session}>
          <Auth>
            <QueryClientProvider client={queryClient}>
              <Hydrate state={reduxProps.pageProps.dehydratedState}>
                <MantineProvider theme={{ ...theme }}>
                  <ModalsProvider
                    modals={{
                      post: PostModal,
                    }}
                  >
                    <NotificationsProvider position="bottom-center">
                      {children}
                    </NotificationsProvider>
                  </ModalsProvider>
                </MantineProvider>
              </Hydrate>
            </QueryClientProvider>
          </Auth>
        </SessionProvider>
      </Provider>
    </Suspense>
  );
};
