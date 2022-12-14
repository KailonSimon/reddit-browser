import React, { useEffect, useReducer } from "react";
import Link from "next/link";
import { ActionIcon, Box, Text } from "@mantine/core";
import CommentReplyArea from "./CommentReplyArea";
import CommentTileControls from "./CommentTileControls";
import { ChevronDown, Lock, Pinned } from "tabler-icons-react";
import {
  fetchMoreChildrenComments,
  getNestedCommentClass,
} from "src/services/Comments/client";
import { getOverlayColor } from "src/services/Format/Color";
import { getRelativeTime } from "src/services/Format/Date";
import { createMarkup } from "src/services/Format/API";
import dynamic from "next/dynamic";

const AwardsContainer = dynamic(() =>
  import("../../components/AwardsContainer").then((res) => res.AwardsContainer)
);
const FlairContainer = dynamic(() =>
  import("../../components/FlairContainer").then((res) => res.FlairContainer)
);

const initialState = {
  isCollapsed: false,
  replyAreaOpen: false,
  isLoading: false,
  moreChildrenLoaded: false,
  replies: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_IS_COLLAPSED":
      return { ...state, isCollapsed: action.payload };
    case "SET_REPLY_AREA_OPEN":
      return { ...state, replyAreaOpen: action.payload };
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_MORE_CHILDREN_LOADED":
      return { ...state, moreChildrenLoaded: action.payload };
    case "SET_REPLIES":
      return { ...state, replies: action.payload };
  }
}

function CommentTile({ comment, depth = 0, variant = "full" }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({
      type: "SET_REPLIES",
      payload: comment?.replies?.data?.children
        ?.filter((reply) => reply.kind !== "more")
        .map((reply) => reply.data),
    });
  }, [comment]);

  const hiddenReplies = comment?.replies?.data?.children?.find(
    (reply) => reply.kind === "more"
  )?.data;

  if (!comment.body || comment.body === "[removed]") {
    return null;
  }

  const handleMoreChildrenClick = async () => {
    try {
      dispatch({ type: "SET_IS_LOADING", payload: true });
      const children = await fetchMoreChildrenComments(
        hiddenReplies.children.toString()
      );
      dispatch({
        type: "SET_REPLIES",
        payload: [...state.replies, ...children.data],
      });
      dispatch({ type: "SET_MORE_CHILDREN_LOADED", payload: true });
      dispatch({ type: "SET_IS_LOADING", payload: false });
    } catch (error) {
      dispatch({ type: "SET_IS_LOADING", payload: false });
      console.log(error);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: 100,
            background: getOverlayColor(comment.all_awardings),
            borderRadius: 4,
            pointerEvents: "none",
          }}
        ></div>
        <div
          className={`comment-depth-${getNestedCommentClass(
            comment.depth || depth
          )} comment-collapse-button`}
          style={{
            display:
              state.isCollapsed || variant === "single" ? "none" : "block",
          }}
          onClick={() => dispatch({ type: "SET_IS_COLLAPSED", payload: true })}
        />
        <Box
          sx={(theme) => ({
            padding: state.isCollapsed
              ? "0 0.75rem 0 0"
              : "0.25rem 0.75rem 0 0.75rem",
            color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
            width: "100%",
          })}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  flexFlow: "row wrap",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {state.isCollapsed && (
                  <ActionIcon
                    onClick={() =>
                      dispatch({ type: "SET_IS_COLLAPSED", payload: false })
                    }
                    sx={{ marginRight: 8 }}
                  >
                    <ChevronDown color="#818384" size={20} />
                  </ActionIcon>
                )}
                <Link href={`/user/${comment.author}`} passHref>
                  <Text
                    color="inherit"
                    weight={500}
                    sx={(theme) => ({
                      fontSize: 12,
                      whiteSpace: "nowrap",
                      color:
                        comment.distinguished === "moderator"
                          ? theme.colors.brand
                          : theme.colorScheme === "dark"
                          ? "#D7DADC"
                          : theme.black,
                      ":hover": {
                        cursor: "pointer",
                        textDecoration: "underline",
                        color: theme.colors.brand,
                      },
                    })}
                  >
                    {comment.stickied && (
                      <Pinned
                        color="#59ba12ff"
                        size={16}
                        style={{ position: "relative", top: 4, marginRight: 2 }}
                      />
                    )}
                    {comment.author}
                  </Text>
                </Link>
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
                <Text
                  size="sm"
                  color="#818384"
                  sx={{ whiteSpace: "nowrap", marginRight: 4 }}
                >
                  {getRelativeTime(comment.created_utc)}
                </Text>
                {comment.locked && (
                  <Lock
                    color="#59ba12ff"
                    size={16}
                    style={{ marginRight: 4 }}
                  />
                )}
                <AwardsContainer awards={comment.all_awardings} />
              </div>
              <FlairContainer submission={comment} type="author" />
            </div>
          </div>
          {!state.isCollapsed && (
            <>
              <div
                className="comment-body"
                dangerouslySetInnerHTML={createMarkup(comment.body)}
              />

              <CommentTileControls
                comment={comment}
                replyAreaOpen={state.replyAreaOpen}
                setReplyAreaOpen={(value) =>
                  dispatch({ type: "SET_REPLY_AREA_OPEN", payload: value })
                }
                variant={variant}
              />
              <CommentReplyArea
                depth={comment.depth || depth}
                parent={comment}
                replyAreaOpen={state.replyAreaOpen}
                setReplyAreaOpen={(value) =>
                  dispatch({ type: "SET_REPLY_AREA_OPEN", payload: value })
                }
                handlePostComment={(value) => {
                  if (state?.replies?.length) {
                    dispatch({
                      type: "SET_REPLIES",
                      payload: [...state.replies, value],
                    });
                  } else {
                    dispatch({
                      type: "SET_REPLIES",
                      payload: [value],
                    });
                  }
                }}
              />
            </>
          )}
        </Box>
        {state.replies?.length > 0 &&
          !state.isCollapsed &&
          variant !== "single" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "0 0 0 0.75rem",
                gap: "0.25rem",
              }}
            >
              {state.replies.map((reply, i) => (
                <CommentTile
                  comment={reply}
                  key={reply.id}
                  depth={comment.depth + 1}
                />
              ))}
            </div>
          )}
        {hiddenReplies &&
          hiddenReplies.children?.length > 0 &&
          !state.isCollapsed &&
          !state.moreChildrenLoaded &&
          variant !== "single" && (
            <Text
              align="left"
              size="sm"
              color="brand"
              weight="bold"
              sx={{
                marginLeft: 10,
                paddingTop: "0.5rem",
                ":hover": { textDecoration: "underline", cursor: "pointer" },
              }}
              onClick={handleMoreChildrenClick}
            >
              {state.isLoading
                ? "loading..."
                : `${hiddenReplies.children?.length} more repl${
                    hiddenReplies.children?.length > 1 ? "ies" : "y"
                  }`}
            </Text>
          )}
      </div>
    </>
  );
}

export default CommentTile;
