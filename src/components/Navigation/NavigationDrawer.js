import { useState } from "react";
import UserMenu from "../User/UserMenu";
import SubredditSearch from "./SearchBar";
import { Burger, Drawer } from "@mantine/core";

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
      </Drawer>
    </>
  );
}

export default NavigationDrawer;
