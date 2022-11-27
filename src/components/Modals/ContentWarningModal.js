import { createStyles, Text, Modal, Button } from "@mantine/core";
import React from "react";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  modal: {
    background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
    display: "flex",
    flexDirection: "column",
    width: "fit-content",
    border: `1px solid ${
      theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
    }`,
    filter: "drop-shadow(0 0.2rem 0.25rem #000)",
  },
  modalBody: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    alignItems: "flex-start",
    paddingTop: "0.5rem",
    width: "fit-content",
  },
}));
export default function ContentWarningModal({ open, handleCloseModal }) {
  const { classes } = useStyles();
  return (
    <Modal
      opened={open}
      onClose={handleCloseModal}
      withCloseButton={false}
      transition="slide-down"
      padding="1rem"
      overlayOpacity={0.65}
      overlayBlur={75}
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      classNames={{
        modal: classes.modal,
        body: classes.modalBody,
      }}
    >
      <Text weight={700} size="lg">
        {
          "This page may contain sensitive or adult content that's not for everyone. To view it, confirm your age."
        }
      </Text>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "flex-end",
          width: "100%",
          marginTop: "1rem",
        }}
      >
        <Link href="/" passHref>
          <Button component="a" color="red" variant="outline">
            {"I'm not over 18"}
          </Button>
        </Link>
        <Button color="red" onClick={handleCloseModal}>
          {"I'm over 18"}
        </Button>
      </div>
    </Modal>
  );
}
