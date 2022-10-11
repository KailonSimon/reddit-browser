import { Anchor, Text } from "@mantine/core";
import React from "react";
import moment from "moment";
import { ArrowUp } from "tabler-icons-react";

function CommentTile({ comment }) {
  if (!comment.body || comment.stickied || comment.body == "[removed]") {
    return null;
  }
  return (
    <div
      style={{
        border: "1px solid #474748",
        padding: "1rem",
        borderRadius: 4,
        color: "#D7DADC",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <div style={{ display: "flex", gap: 8, flexFlow: "row" }}>
          <Anchor
            href={`https://www.reddit.com/user/${comment.author}`}
            target="_blank"
            rel="noreferrer"
            color="inherit"
            variant="text"
            weight="bold"
            sx={(theme) => ({
              fontSize: 12,
              whiteSpace: "nowrap",
              ":hover": {
                cursor: "pointer",
                textDecoration: "underline",
                color: theme.colors.accent,
              },
            })}
          >
            {comment.author}
          </Anchor>
          <div style={{ display: "flex", alignItems: "center" }}>
            <ArrowUp size={16} color="#818384" />
            <Text size="sm" color="#818384">
              {comment.score}
            </Text>
          </div>
        </div>
        <Text size="sm" color="#818384" sx={{ whiteSpace: "nowrap" }}>
          {moment.unix(comment.created).fromNow()}
        </Text>
      </div>
      <Text weight={700} sx={{ fontSize: 14, wordBreak: "break-word" }}>
        {comment.body}
      </Text>
    </div>
  );
}

export default CommentTile;
