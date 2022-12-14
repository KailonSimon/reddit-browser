import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAuthentication } from "src/store/AuthSlice";
import LoadingScreen from "src/components/LoadingScreen";

function Auth({ children }) {
  const router = useRouter();
  const authentication = useSelector(selectAuthentication);
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      if (
        router.pathname !== "/auth/signin" &&
        authentication.status !== "demo"
      ) {
        router.push("/auth/signin");
      }
    },
  });
  if (
    status === "loading" &&
    authentication.status !== "demo" &&
    router.pathname !== "/auth/signin"
  ) {
    return <LoadingScreen />;
  }
  return children;
}

export default Auth;
