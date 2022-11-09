import { ActionIcon, Anchor, Box, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { ArrowUp, ChevronDown } from "tabler-icons-react";
import { getNestedCommentClass, getRelativeTime } from "../../utils";
import CommentReplyArea from "./CommentReplyArea";
import CommentTitleControls from "./CommentTitleControls";
import SubmissionMenu from "./SubmissionMenu";

function CommentTile({ comment }) {
  const [replies, setReplies] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [replyAreaOpen, setReplyAreaOpen] = useState(false);

  useEffect(() => {
    if (comment?.replies?.data) {
      setReplies(
        comment.replies.data.children.filter((reply) => reply.kind !== "more")
      );
    }
  }, [comment]);
  if (!comment.body || comment.stickied) {
    return null;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        position: "relative",
      }}
    >
      <div
        className={`comment-depth-${getNestedCommentClass(
          comment.depth
        )} comment-collapse-button`}
        style={{ display: isCollapsed ? "none" : "block" }}
        onClick={() => setIsCollapsed(true)}
      />
      <Box
        sx={(theme) => ({
          padding: isCollapsed ? "0 0.75rem 0 0" : "0.25rem 0.75rem 0.5rem",
          color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
          width: "100%",
        })}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: isCollapsed ? 0 : 4,
          }}
        >
          <div
            style={{
              display: "flex",
              flexFlow: "row wrap",
              alignItems: "center",
            }}
          >
            {isCollapsed && (
              <ActionIcon
                onClick={() => setIsCollapsed(false)}
                sx={{ marginRight: 8 }}
              >
                <ChevronDown color="#818384" size={20} />
              </ActionIcon>
            )}
            <Anchor
              href={`/user/${comment.author}`}
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
                  color: theme.colors.brand,
                },
              })}
            >
              {comment.author}
            </Anchor>
            {comment.is_submitter && (
              <span
                style={{
                  marginLeft: 4,
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "#59ba12",
                }}
              >
                OP
              </span>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                marginLeft: 4,
              }}
            >
              <ArrowUp size={16} color="#818384" />
              <Text size="sm" color="#818384">
                {comment.score}
              </Text>
            </div>
            <span
              style={{
                flex: "0 0 auto",
                margin: "0 4px 4px",
                color: "#818384",
                display: "flex",
                verticalAlign: "top",
              }}
            >
              &#8226;
            </span>
            <Text size="sm" color="#818384" sx={{ whiteSpace: "nowrap" }}>
              {getRelativeTime(comment.created)}
            </Text>
          </div>
        </div>
        {!isCollapsed && (
          <div>
            <Text sx={{ fontSize: 14, wordBreak: "break-word" }}>
              {comment.body}
            </Text>
            <CommentTitleControls
              comment={comment}
              setReplyAreaOpen={setReplyAreaOpen}
            />
            <CommentReplyArea
              comment={comment}
              replyAreaOpen={replyAreaOpen}
              setReplyAreaOpen={setReplyAreaOpen}
            />
          </div>
        )}
      </Box>
      {replies.length > 0 && !isCollapsed && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0 0 0 0.75rem",
            gap: "0.25rem",
          }}
        >
          {replies.map((reply) => (
            <CommentTile comment={reply.data} key={reply.data.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentTile;
