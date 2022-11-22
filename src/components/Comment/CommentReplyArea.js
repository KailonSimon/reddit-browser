import { Button, createStyles, Textarea } from "@mantine/core";
import { openModal, closeModal } from "@mantine/modals";
import { useSession } from "next-auth/react";
import React, { useId, useState } from "react";
import { getNestedCommentClass } from "../../../utils";
import SignInButton from "../Authentication/SignInButton";

const useStyles = createStyles((theme) => ({
  modalContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 16,
  },
}));

function CommentReplyArea({ replyAreaOpen, setReplyAreaOpen, depth }) {
  const { classes } = useStyles();
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const modalId = useId();

  const handleSubmit = () => {
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
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        position: "relative",
        display: replyAreaOpen ? "block" : "none",
        marginTop: 16,
      }}
    >
      <div
        className={`comment-depth-${getNestedCommentClass(
          depth + 1
        )} comment-collapse-button`}
        style={{
          height: "100%",
          borderRight: "4px solid transparent",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Textarea
          placeholder="What's on your mind?"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          styles={{ root: { marginLeft: 12 } }}
        />
        <div
          style={{
            marginTop: "0.5rem",
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
            height: "2rem",
            marginLeft: 12,
          }}
        >
          <Button
            size="xs"
            variant="outline"
            onClick={() => setReplyAreaOpen(false)}
          >
            Cancel
          </Button>
          <Button size="xs" disabled={!input} onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CommentReplyArea;
