import { Burger, Drawer } from "@mantine/core";
import { useState } from "react";
import SubredditSearch from "./SubredditSearch";
function NavigationDrawer() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Burger
        opened={opened}
        onClick={() => setOpened((o) => !o)}
        color="#59ba12"
      />
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        padding="xl"
        size="md"
        position="right"
        withCloseButton={false}
        styles={{
          drawer: {
            marginTop: "4rem",
          },
        }}
      >
        <SubredditSearch />
      </Drawer>
    </>
  );
}

export default NavigationDrawer;
