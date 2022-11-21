import React from "react";
import { Button, createStyles } from "@mantine/core";
import { BrandReddit } from "tabler-icons-react";
import { useRouter } from "next/router";
import { getProviders, signIn } from "next-auth/react";

const useStyles = createStyles((theme) => ({
  container: {
    height: "100vh",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[9]
        : theme.colors.gray[2],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function SignIn({ providers }) {
  const { classes } = useStyles();
  const { callbackUrl } = useRouter().query;
  return (
    <div className={classes.container}>
      <div className={classes.controls}>
        {providers &&
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

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
