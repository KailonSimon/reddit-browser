import React from "react";
import Link from "next/link";
import { Button, SegmentedControl, Text } from "@mantine/core";

function CommentSectionControls({
  post,
  isLoading,
  isFetching,
  isRefetching,
  commentSorting,
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
            alignItems: "center",
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
          label={<Text mb={4}>Sort By</Text>}
          value={commentSorting}
          data={[
            {
              value: "confidence",
              label: `Best ${
                post.suggested_sort === "confidence" ? "(suggested)" : ""
              }`,
            },
            {
              value: "top",
              label: `Top ${
                post.suggested_sort === "top" ? "(suggested)" : ""
              }`,
            },
            {
              value: "new",
              label: `New ${
                post.suggested_sort === "new" ? "(suggested)" : ""
              }`,
            },
            {
              value: "random",
              label: `Random ${
                post.suggested_sort === "random" ? "(suggested)" : ""
              }`,
            },
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
