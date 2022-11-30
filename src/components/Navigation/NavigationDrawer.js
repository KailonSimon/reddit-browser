import { useState } from "react";
import { Burger, Drawer } from "@mantine/core";
import SubredditSearch from "../SubredditSearch";
import SignInButton from "../Authentication/SignInButton";
import { useSession } from "next-auth/react";
import SignOutButton from "../Authentication/SignOutButton";
import UserMenu from "../UserMenu";

function NavigationDrawer({ user }) {
  const [opened, setOpened] = useState(false);
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
        size="100%"
        position="right"
        withCloseButton={false}
        styles={(theme) => ({
          root: { zIndex: 99 },
          drawer: {
            marginTop: "4rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
          },
        })}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {user ? <UserMenu user={user} /> : null}
          <SubredditSearch />
        </div>
        <SignOutButton />
      </Drawer>
    </>
  );
}

export default NavigationDrawer;
