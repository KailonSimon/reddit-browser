import React from "react";
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
import numeral from "numeral";
import { voteOnSubmission } from "src/services/Posts/client";

const useStyles = createStyles((theme) => ({
  verticalContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "min-content",
    minWidth: 30,
  },
  horizontalContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: 30,
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
        variant="transparent"
        onClick={() => handleVoteClick("up")}
        className={classes.upArrow}
      >
        {isUpvoted ? (
          <TiArrowUpThick size={24} color="#59ba12" />
        ) : (
          <TiArrowUpOutline size={20} color="#909296" />
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
          ? numeral(submission.score + 1).format("0.[0]a")
          : isDownvoted
          ? numeral(submission.score - 1).format("0.[0]a")
          : numeral(submission.score).format("0.[0]a")}
      </Text>
      <ActionIcon
        variant="transparent"
        onClick={() => handleVoteClick("down")}
        className={classes.downArrow}
      >
        {isDownvoted ? (
          <TiArrowDownThick size={24} color="#7312ba" />
        ) : (
          <TiArrowDownOutline size={20} color="#909296" />
        )}
      </ActionIcon>
    </div>
  );
}

export default SubmissionVotingControls;
