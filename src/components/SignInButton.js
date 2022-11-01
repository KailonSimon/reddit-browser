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
    >
      Sign in with Reddit
    </Button>
  );
}

export default SignInButton;
