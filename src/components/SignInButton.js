import { Button } from "@mantine/core";
import { useSession, signIn, signOut } from "next-auth/react";
import { BrandReddit } from "tabler-icons-react";

function SignInButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <Button size="sm" onClick={() => signOut()} color="red">
        Sign out
      </Button>
    );
  }
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
