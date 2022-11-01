import { Button } from "@mantine/core";
import { signOut } from "next-auth/react";
import { Logout } from "tabler-icons-react";
import { openConfirmModal } from "@mantine/modals";

function SignOutButton() {
  const openSignOutModal = () =>
    openConfirmModal({
      title: "Sign out of Reddit?",
      centered: true,
      labels: { confirm: "Sign out", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => signOut(),
    });
  return (
    <Button color="red" size="sm" icon={<Logout />} onClick={openSignOutModal}>
      Sign out
    </Button>
  );
}

export default SignOutButton;
