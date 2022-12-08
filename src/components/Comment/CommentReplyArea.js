import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { selectAuthentication } from "src/store/AuthSlice";
import { Button, Textarea, Text, Loader } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useMediaQuery } from "@mantine/hooks";
import { Check } from "tabler-icons-react";
import {
  createDemoComment,
  getNestedCommentClass,
} from "src/services/Comments/client";

function CommentReplyArea({
  replyAreaOpen,
  setReplyAreaOpen,
  depth,
  variant,
  handlePostComment,
  parent,
}) {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const authentication = useSelector(selectAuthentication);
  const isMobile = useMediaQuery("(max-width: 700px)");
  const { subreddit_id, subreddit } = parent;

  const handleSubmit = () => {
    showNotification({
      id: "send-comment",
      title: "Posting comment",
      loading: true,
      autoClose: false,
      disallowClose: true,
    });

    setIsLoading(true);

    setTimeout(() => {
      updateNotification({
        id: "send-comment",
        title: "Success!",
        message: "Your comment has been posted successfully",
        icon: <Check size={16} />,
        autoClose: 3000,
      });
      if (handlePostComment) {
        handlePostComment(
          createDemoComment(subreddit_id, subreddit, input, depth)
        );
      }
      setInput("");
      if (variant !== "link") {
        setReplyAreaOpen(false);
      }
      setIsLoading(false);
    }, 3000);
  };

  if (variant === "link") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: isMobile ? "0 8px" : "0.5rem 40px",
          gap: "0.5rem",
        }}
      >
        <Textarea
          label={
            <Text sx={{ display: "flex", gap: 3 }}>
              Comment as{" "}
              <Link
                href={
                  authentication.status === "demo"
                    ? `/user/demoUserID`
                    : `/user/${session.user.name}`
                }
                passHref
              >
                <Text color="brand">
                  {authentication.status === "demo"
                    ? "DemoUser"
                    : session.user.name}
                </Text>
              </Link>
            </Text>
          }
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          spellCheck="false"
          disabled={isLoading}
        />
        <Button
          size="xs"
          sx={{ alignSelf: "end" }}
          disabled={!input || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? <Loader size="xs" color="brand" /> : "Comment"}
        </Button>
      </div>
    );
  }

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
          spellCheck="false"
          disabled={isLoading}
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
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            size="xs"
            disabled={!input || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? <Loader size="xs" color="brand" /> : "Comment"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CommentReplyArea;
