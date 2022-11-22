import { Button, SegmentedControl, Text } from "@mantine/core";
import Link from "next/link";
import React from "react";

function CommentSectionControls({
  post,
  isLoading,
  isFetching,
  isRefetching,
  handleChangeCommentSort,
  commentId,
}) {
  return (
    <>
      {commentId && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <Text color="brand" weight="bold">
            Viewing single comment thread
          </Text>
          <Link href={`/post/${post.id}`} passHref>
            <Button component="a" variant="outline">
              View all comments
            </Button>
          </Link>
        </div>
      )}
      <div
        style={{
          width: "100%",
          padding: "0",
        }}
      >
        <SegmentedControl
          fullWidth
          color="brand"
          radius={4}
          label={
            <Text color="#D7DADC" mb={4}>
              Sort By
            </Text>
          }
          data={[
            { value: "confidence", label: "Best" },
            { value: "top", label: "Top" },
            { value: "new", label: "New" },
            { value: "random", label: "Random" },
          ]}
          onChange={(value) => handleChangeCommentSort(value)}
          styles={(theme) => ({
            root: {
              border: `1px solid ${
                theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
              }`,
              background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
            },
          })}
          disabled={isLoading || isFetching || isRefetching}
        />
      </div>
    </>
  );
}

export default CommentSectionControls;
