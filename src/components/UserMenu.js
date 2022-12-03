import { forwardRef } from "react";
import { ChevronDown, Logout } from "tabler-icons-react";
import { Avatar, Text, Menu, UnstyledButton } from "@mantine/core";
import { signOut } from "next-auth/react";
import { openConfirmModal } from "@mantine/modals";
import numeral from "numeral";
import { useAppDispatch } from "../../store/store";
import { setAuthenticationStatus } from "../../store/AuthSlice";
import Link from "next/link";

const UserButton = forwardRef(({ user, icon, ...others }, ref) => (
  <UnstyledButton
    ref={ref}
    sx={(theme) => ({
      background: theme.colorScheme === "dark" ? theme.colors.dark[7] : "#fff",
      color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
      borderRadius: "4px",
      padding: "0 0.5rem",
      height: 42,
      minWidth: "3rem",
      borderRadius: 4,
      overflow: "hidden",
      "&:hover": {
        outline: `1px solid ${theme.colors.dark[4]}`,
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar src={user.snoovatar_img} radius="xl" size={30} />
      </div>

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
  const reduxDispatch = useAppDispatch();

  const openSignOutModal = () =>
    openConfirmModal({
      title: "Sign out of Reddit?",
      centered: true,
      labels: { confirm: "Sign out", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: user.is_demo
        ? () => reduxDispatch(setAuthenticationStatus("unauthenticated"))
        : () => signOut(),
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
        <Link
          href={user.is_demo ? `/user/DemoUser` : `/user/${user.name}`}
          passHref
        >
          <Menu.Item>Profile</Menu.Item>
        </Link>
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
