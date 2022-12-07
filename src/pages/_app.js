import "src/styles/globals.css";
import { AppProvider } from "src/providers/app";
import { wrapper } from "src/store/store";

function MyApp({ Component, ...appProps }) {
  const { store, props: reduxProps } = wrapper.useWrappedStore(appProps);

  return (
    <AppProvider reduxProps={reduxProps} reduxStore={store}>
      <Component {...reduxProps.pageProps} />
    </AppProvider>
  );
}

export default MyApp;
