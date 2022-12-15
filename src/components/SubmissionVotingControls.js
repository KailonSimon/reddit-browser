import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useAppDispatch } from "src/store/store";
import { selectAuthentication } from "src/store/AuthSlice";
import {
  selectDemoUser,
  upvoteSubmission,
  downvoteSubmission,
} from "src/store/DemoUserSlice";
import SignInButton from "./Authentication/SignInButton";
import { useId } from "@mantine/hooks";
import { createStyles, Text, Button, ActionIcon } from "@mantine/core";
import { closeModal, openModal } from "@mantine/modals";
import {
  TiArrowUpOutline,
  TiArrowUpThick,
  TiArrowDownOutline,
  TiArrowDownThick,
} from "react-icons/ti";
import { voteOnSubmission } from "src/services/Posts/client";
import { condenseNumber } from "src/services/Format/API";

const useStyles = createStyles((theme) => ({
  verticalContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "min-content",
    minWidth: 40,
    gap: "2px",
  },
  horizontalContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: 30,
    gap: "4px",
  },
  modalContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 16,
  },
  upArrow: {
    color: "#909296",
    "&:hover": { color: theme.colors.brand },
  },
  downArrow: {
    color: "#909296",
    "&:hover": { color: theme.colors.accent },
  },
}));
function SubmissionVotingControls({ variant, submission }) {
  const { classes } = useStyles();
  const { data: session } = useSession();
  const authentication = useSelector(selectAuthentication);
  const modalId = useId();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const { upvotedSubmissions, downvotedSubmissions } =
    useSelector(selectDemoUser);

  const isUpvoted = upvotedSubmissions.some(
    (upvotedSubmission) => submission.id === upvotedSubmission.id
  );
  const isDownvoted = downvotedSubmissions.some(
    (downvotedSubmission) => submission.id === downvotedSubmission.id
  );

  const { mutate } = useMutation(
    ({ id, direction }) => voteOnSubmission(id, direction),
    {
      onSuccess: async (updatedSubmission) => {
        queryClient.invalidateQueries();
      },
    }
  );

  const handleVoteClick = async (direction) => {
    if (!session && authentication.status !== "demo") {
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
    } else if (authentication.status === "demo") {
      switch (direction) {
        case "up":
          dispatch(upvoteSubmission(submission));
          break;
        case "down":
          dispatch(downvoteSubmission(submission));
      }
    } else {
      mutate({ id: submission.name, direction });
    }
  };
  return (
    <div
      className={
        variant == "vertical"
          ? classes.verticalContainer
          : classes.horizontalContainer
      }
    >
      <ActionIcon
        variant="subtle"
        onClick={() => handleVoteClick("up")}
        className={classes.upArrow}
        size="sm"
      >
        {isUpvoted ? (
          <TiArrowUpThick size={24} color="#59ba12" />
        ) : (
          <TiArrowUpOutline size={20} />
        )}
      </ActionIcon>
      <Text
        sx={(theme) => ({
          color: isUpvoted
            ? "#59ba12"
            : isDownvoted
            ? "#7312ba"
            : theme.colorScheme === "dark"
            ? "#D7DADC"
            : theme.black,
          fontSize: 12,
          fontWeight: 700,
        })}
      >
        {isUpvoted
          ? condenseNumber(submission.score + 1)
          : isDownvoted
          ? condenseNumber(submission.score - 1)
          : condenseNumber(submission.score)}
      </Text>
      <ActionIcon
        variant="subtle"
        onClick={() => handleVoteClick("down")}
        className={classes.downArrow}
        size="sm"
      >
        {isDownvoted ? (
          <TiArrowDownThick size={24} color="#7312ba" />
        ) : (
          <TiArrowDownOutline size={20} />
        )}
      </ActionIcon>
    </div>
  );
}

export default SubmissionVotingControls;
