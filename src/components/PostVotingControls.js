import React, { useState } from "react";
import { createStyles, Text, Button, ActionIcon } from "@mantine/core";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(post.likes);

  const { mutate } = useMutation(
    ({ id, direction }) => voteOnSubmission(id, direction),
    {
      onSuccess: async (updatedPost) => {
        setLiked(updatedPost.likes);
        queryClient.invalidateQueries();
      },
    }
  );

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
      mutate({ id: post.name, direction });
    }
  };
  return (
    <div className={classes.container}>
      <ActionIcon
        variant="transparent"
        onClick={() => handleVoteClick(liked ? "unvote" : "up")}
        className={classes.upArrow}
      >
        {liked === true ? (
          <TiArrowUpThick size={28} color="#59ba12" />
        ) : (
          <TiArrowUpOutline size={24} color="#ADB5BD" />
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
        onClick={() => handleVoteClick(liked === false ? "unvote" : "down")}
        className={classes.downArrow}
      >
        {liked === false ? (
          <TiArrowDownThick size={28} color="#7312ba" />
        ) : (
          <TiArrowDownOutline size={24} color="#ADB5BD" />
        )}
      </ActionIcon>
    </div>
  );
}

export default PostVotingControls;
