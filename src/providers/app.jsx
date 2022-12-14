import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { theme } from "src/styles/theme";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { queryClient } from "src/lib/react-query";
import dynamic from "next/dynamic";

const PostModal = dynamic(() => import("../components/Post/PostModal"));
const LoadingScreen = dynamic(() => import("../components/LoadingScreen"));

export const AppProvider = ({ children, reduxProps, reduxStore }) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Provider store={reduxStore}>
        <SessionProvider session={reduxProps.pageProps.session}>
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
        </SessionProvider>
      </Provider>
    </Suspense>
  );
};
