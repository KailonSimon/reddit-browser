import { Button } from "@mantine/core";
import React, { useEffect } from "react";
import { Message } from "tabler-icons-react";
import SubmissionMenu from "./SubmissionMenu";
import SubmissionVotingControls from "./SubmissionVotingControls";

function CommentTitleControls({ comment, setReplyAreaOpen }) {
  return (
    <div
      style={{
        display: "flex",
        height: 40,
        padding: "4px 0",
      }}
    >
      <SubmissionVotingControls type="comment" submission={comment} />
      <Button
        size="xs"
        variant="subtle"
        color="dark"
        radius={0}
        onClick={() => setReplyAreaOpen((o) => !o)}
        leftIcon={<Message size="18" />}
        styles={{ root: { padding: 8 }, leftIcon: { marginRight: 4 } }}
      >
        Reply
      </Button>
      <SubmissionMenu type="comment" submission={comment} />
    </div>
  );
}

export default CommentTitleControls;
