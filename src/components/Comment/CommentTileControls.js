import { Button } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import { Message } from "tabler-icons-react";
import SubmissionMenu from "../SubmissionMenu";
import SubmissionVotingControls from "../SubmissionVotingControls";

function CommentTileControls({
  comment,
  replyAreaOpen,
  setReplyAreaOpen,
  variant,
}) {
  const router = useRouter();
  const handleReplyClick = () => {
    if (variant === "full") {
      setReplyAreaOpen(!replyAreaOpen);
    } else {
      router.push(`/comment/${comment.id}`, null, { shallow: true });
    }
  };
  return (
    <div
      style={{
        display: "flex",
        height: 40,
        padding: "4px 0 0",
        alignItems: "center",
      }}
    >
      <SubmissionVotingControls variant="horizontal" submission={comment} />
      <Button
        size="xs"
        radius={4}
        onClick={handleReplyClick}
        leftIcon={<Message size={20} />}
        styles={(theme) => ({
          root: {
            padding: 8,
            background: "transparent",
            color: theme.colorScheme === "dark" ? "#909296" : theme.black,
            "&:hover": {
              background: "rgba(52, 58, 64, 0.2)",
            },
          },
          leftIcon: { marginRight: 4 },
        })}
      >
        Reply
      </Button>
      <SubmissionMenu type="comment" submission={comment} />
    </div>
  );
}

export default CommentTileControls;
