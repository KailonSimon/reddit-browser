import { Button } from "@mantine/core";
import { signIn } from "next-auth/react";
import { BrandReddit } from "tabler-icons-react";

function SignInButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      leftIcon={<BrandReddit />}
      onClick={() => signIn()}
      sx={(theme) => ({
        ":hover": {
          background: theme.colors.brand,
          color: theme.colors.dark[9],
        },
      })}
    >
      Sign in with Reddit
    </Button>
  );
}

export default SignInButton;
