import React, { useEffect } from "react";
import { Button, createStyles } from "@mantine/core";
import { BrandReddit, TestPipe } from "tabler-icons-react";
import { useRouter } from "next/router";
import { getProviders, signIn } from "next-auth/react";
import { setAuthenticationStatus } from "../../store/AuthSlice";
import { useAppDispatch, wrapper } from "../../store/store";

const useStyles = createStyles((theme) => ({
  container: {
    height: "100vh",
    backgroundColor:
      theme.colorScheme === "dark" ? "#030303" : theme.colors.gray[2],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
}));

export default function SignIn({ providers }) {
  const { classes } = useStyles();
  const router = useRouter();
  const reduxDispatch = useAppDispatch();

  const handleDemoSignIn = () => {
    reduxDispatch(setAuthenticationStatus("demo"));
    router.push("/", null, { shallow: true });
  };

  return (
    <div className={classes.container}>
      <div className={classes.controls}>
        <Button
          leftIcon={<TestPipe size={32} />}
          fullWidth
          size="xl"
          radius="xl"
          sx={{
            background: "#FF4500",
            ":hover": {
              background: "#FF5700",
            },
          }}
          key={"demo"}
          onClick={handleDemoSignIn}
        >
          Demo Sign in
        </Button>

        {false &&
          providers &&
          Object.values(providers).map((provider) => (
            <Button
              leftIcon={<BrandReddit size={32} />}
              fullWidth
              size="xl"
              radius="xl"
              sx={{
                background: "#FF4500",
                ":hover": {
                  background: "#FF5700",
                },
              }}
              key={provider.id}
              onClick={() => signIn(provider.id, { callbackUrl })}
            >
              Sign in with {provider.name}
            </Button>
          ))}
      </div>
    </div>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const providers = await getProviders();
    return {
      props: { providers },
    };
  }
);
