import { signIn } from "next-auth/react";
import { Button } from "@mantine/core";
import { BrandReddit } from "tabler-icons-react";

function SignInButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      leftIcon={<BrandReddit />}
      onClick={() => signIn()}
      sx={(theme) => ({
        fontWeight: 700,
        height: 42,
        borderRadius: 4,
        border: `2px solid ${theme.colors.brand[6]}`,
        background: theme.colors.dark[7],
        [theme.fn.largerThan("md")]: {
          borderRadius: 999,
        },
        ":hover": {
          border: `2px solid transparent`,
          background: theme.colors.brand[6],
          color: theme.white,
          transitionDuration: "200ms",
          transitionPropery: "background, color",
        },
      })}
    >
      Sign in with Reddit
    </Button>
  );
}

export default SignInButton;
