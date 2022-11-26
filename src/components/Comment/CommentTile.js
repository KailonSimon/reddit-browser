import { ActionIcon, Anchor, Badge, Box, Image, Text } from "@mantine/core";
import numeral from "numeral";
import React, { useEffect, useReducer } from "react";
import { ArrowUp, ChevronDown, Lock, Pinned } from "tabler-icons-react";
import {
  fetchMoreChildrenComments,
  getNestedCommentClass,
  getRelativeTime,
} from "../../../utils";
import CommentReplyArea from "./CommentReplyArea";
import CommentTileControls from "./CommentTileControls";
import { markdown } from "snudown-js";

const initialState = {
  isCollapsed: false,
  isReplyAreaOpen: false,
  isLoading: false,
  moreChildrenLoaded: false,
  replies: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_IS_COLLAPSED":
      return { ...state, isCollapsed: action.payload };
    case "SET_IS_REPLY_AREA_OPEN":
      return { ...state, isReplyAreaOpen: action.payload };
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_MORE_CHILDREN_LOADED":
      return { ...state, moreChildrenLoaded: action.payload };
    case "SET_REPLIES":
      return { ...state, replies: action.payload };
    default:
      return initialState;
  }
}

function CommentTile({ comment, depth = 0 }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({
      type: "SET_REPLIES",
      payload: comment?.replies?.data?.children?.reduce(function (data, reply) {
        if (reply.kind !== "more") {
          data.push(reply.data);
        }
        return data;
      }, []),
    });
  }, [comment]);

  const hiddenReplies = comment?.replies?.data?.children?.filter(
    (reply) => reply.kind === "more"
  )[0]?.data;

  function createMarkup() {
    return { __html: markdown(comment.body, { target: "_blank" }) };
  }

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
          className={`comment-depth-${getNestedCommentClass(
            comment.depth || depth
          )} comment-collapse-button`}
          style={{ display: state.isCollapsed ? "none" : "block" }}
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
              marginBottom: state.isCollapsed ? 0 : 4,
            }}
          >
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
              <Anchor
                href={`/user/${comment.author}`}
                target="_blank"
                rel="noreferrer"
                color="inherit"
                variant="text"
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
              {comment.author_flair_richtext?.length > 0 && (
                <Badge
                  size="sm"
                  variant="light"
                  radius={4}
                  ml={8}
                  leftSection={
                    comment.author_flair_richtext.length > 1 ? (
                      <Image
                        height={14}
                        fit="contain"
                        src={comment.author_flair_richtext[0]?.u}
                        alt={comment.author_flair_richtext[1]?.t}
                      />
                    ) : null
                  }
                >
                  {comment.author_flair_richtext.length > 1
                    ? comment.author_flair_richtext[1].t
                    : comment.author_flair_richtext[0].t}
                </Badge>
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
                  {comment.score_hidden
                    ? "—"
                    : numeral(comment.score).format("0.[0]a")}
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
                {getRelativeTime(comment.created_utc)}
              </Text>
              {comment.locked && (
                <Lock color="#59ba12ff" size={16} style={{ marginLeft: 4 }} />
              )}
            </div>
          </div>
          {!state.isCollapsed && (
            <div>
              <Text sx={{ fontSize: 14, wordBreak: "break-word" }}>
                {<div dangerouslySetInnerHTML={createMarkup()} />}
              </Text>
              <CommentTileControls
                comment={comment}
                replyAreaOpen={state.isReplyAreaOpen}
                setReplyAreaOpen={(value) =>
                  dispatch({ type: "SET_IS_REPLY_AREA_OPEN", payload: value })
                }
              />
              <CommentReplyArea
                depth={comment.depth || depth}
                comment={comment}
                replyAreaOpen={state.isReplyAreaOpen}
                setReplyAreaOpen={(value) =>
                  dispatch({ type: "SET_IS_REPLY_AREA_OPEN", payload: value })
                }
              />
            </div>
          )}
        </Box>
        {state.replies?.length > 0 && !state.isCollapsed && (
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
          !state.moreChildrenLoaded && (
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
