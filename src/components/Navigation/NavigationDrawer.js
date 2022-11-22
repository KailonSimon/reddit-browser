import { useState } from "react";
import { Burger, Drawer } from "@mantine/core";
import SubredditSearch from "../SubredditSearch";
import SignInButton from "../Authentication/SignInButton";
import { useSession } from "next-auth/react";
import SignOutButton from "../Authentication/SignOutButton";

function NavigationDrawer() {
  const [opened, setOpened] = useState(false);
  const { data: session } = useSession();
  return (
    <>
      <Burger
        opened={opened}
        onClick={() => setOpened((o) => !o)}
        color="#59ba12"
        size="sm"
      />
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        padding="xl"
        size="md"
        position="right"
        withCloseButton={false}
        styles={(theme) => ({
          drawer: {
            marginTop: "4rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
          },
        })}
      >
        <SubredditSearch />
        {session ? <SignOutButton /> : <SignInButton />}
      </Drawer>
    </>
  );
}

export default NavigationDrawer;
