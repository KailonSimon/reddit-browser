import { forwardRef } from "react";
import { ChevronDown, Logout } from "tabler-icons-react";
import {
  Avatar,
  Text,
  Menu,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import { signOut } from "next-auth/react";
import { openConfirmModal } from "@mantine/modals";
import numeral from "numeral";

const UserButton = forwardRef(({ user, icon, ...others }, ref) => (
  <UnstyledButton
    ref={ref}
    sx={(theme) => ({
      border: `1px solid ${
        theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
      }`,
      backgroundColor: theme.colorScheme === "dark" ? "#121212" : "#fff",
      color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
      borderRadius: "4px",
      padding: "0 0.25rem",

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[0],
      },
    })}
    {...others}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",

        gap: "0.25rem",
      }}
    >
      <Avatar src={user.snoovatar_img} radius="xl" />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Text size="xs" weight={500}>
          {user.name}
        </Text>

        <Text color="dimmed" size="xs">
          {numeral(user.total_karma).format("0a")} karma
        </Text>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: 4,
        }}
      >
        <ChevronDown size={16} />
      </div>
    </div>
  </UnstyledButton>
));

UserButton.displayName = "UserButton";

function UserMenu({ user }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const openSignOutModal = () =>
    openConfirmModal({
      title: "Sign out of Reddit?",
      centered: true,
      labels: { confirm: "Sign out", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => signOut(),
    });

  return (
    <Menu
      width={200}
      styles={(theme) => ({
        dropdown: {
          border: `1px solid ${
            theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
          }`,
          borderRadius: 4,
          background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
        },
      })}
    >
      <Menu.Target>
        <UserButton user={user} />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component="a" href={`/user/${user.name}`}>
          Profile
        </Menu.Item>

        {/*<Menu.Divider />
        <Menu.Label>Theme options</Menu.Label>
        <Switch
          styles={{
            root: { display: "flex", padding: "0.5rem 0" },
          }}
          label="Dark theme"
          checked={colorScheme === "dark"}
          onChange={() => toggleColorScheme()}
        />*/}
        <Menu.Divider />
        <Menu.Item
          color="red"
          icon={<Logout size={14} />}
          onClick={() => openSignOutModal()}
        >
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default UserMenu;
