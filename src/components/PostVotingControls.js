import React, { useEffect, useState } from "react";
import { createStyles, Text, Button, ActionIcon } from "@mantine/core";
import { ArrowBigDown, ArrowBigTop } from "tabler-icons-react";
import numeral from "numeral";
import { useSession } from "next-auth/react";
import { closeModal, openModal } from "@mantine/modals";
import { useId } from "@mantine/hooks";
import SignInButton from "./SignInButton";
import { voteOnSubmission } from "../../utils";
import {
  TiArrowUpOutline,
  TiArrowUpThick,
  TiArrowDownOutline,
  TiArrowDownThick,
} from "react-icons/ti";

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 30,
    minWidth: 30,
  },
  modalContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 16,
  },
  upArrow: {
    "&:hover": { color: theme.colors.brand, cursor: "pointer" },
  },
  downArrow: {
    "&:hover": { color: theme.colors.accent, cursor: "pointer" },
  },
}));

function PostVotingControls({ post }) {
  const { classes } = useStyles();
  const { data: session } = useSession();
  const modalId = useId();
  const [voteState, setVoteState] = useState(0);

  const handleVoteClick = async (direction) => {
    if (!session) {
      openModal({
        modalId,
        title: "You must be signed in to vote.",
        centered: true,
        children: (
          <div className={classes.modalContainer}>
            <Button color="gray" onClick={() => closeModal(modalId)}>
              Cancel
            </Button>
            <SignInButton />
          </div>
        ),
        withCloseButton: false,
      });
    } else {
      //voteOnSubmission(post.name, direction);
      switch (direction) {
        case "up":
          if (voteState === 1) {
            setVoteState(0);
          } else {
            setVoteState(1);
          }
          break;
        case "down":
          if (voteState === -1) {
            setVoteState(0);
          } else {
            setVoteState(-1);
          }
          break;
      }
    }
  };
  return (
    <div className={classes.container}>
      <ActionIcon
        variant="transparent"
        onClick={() => handleVoteClick("up")}
        className={classes.upArrow}
      >
        {voteState === 1 ? (
          <TiArrowUpThick size={28} />
        ) : (
          <TiArrowUpOutline size={24} />
        )}
      </ActionIcon>
      <Text
        sx={(theme) => ({
          color:
            theme.colorScheme === "dark" ? "rgb(215, 218, 220)" : theme.black,
          fontSize: 12,
        })}
      >
        {numeral(post.score).format("0a")}
      </Text>
      <ActionIcon
        variant="transparent"
        onClick={() => handleVoteClick("down")}
        className={classes.downArrow}
      >
        {voteState === -1 ? (
          <TiArrowDownThick size={28} />
        ) : (
          <TiArrowDownOutline size={24} />
        )}
      </ActionIcon>
    </div>
  );
}

export default PostVotingControls;
