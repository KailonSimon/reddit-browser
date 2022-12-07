import { createStyles, Anchor, Title } from "@mantine/core";
import { visitPost } from "../../../store/DemoUserSlice";
import { useAppDispatch } from "../../../store/store";
import PostTile from "../Post/PostTile";
import { openContextModal } from "@mantine/modals";

const useStyles = createStyles((theme) => ({
  posts: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "100%",
    gap: 8,
    height: "100%",
    padding: "0 0 2rem",
  },
  modal: {
    background: "transparent",
    display: "flex",
    flexDirection: "column",
    width: "fit-content",
  },
  modalBody: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    alignItems: "flex-start",
    paddingTop: "0.5rem",
    width: "fit-content",
  },
  modalInner: {
    [theme.fn.smallerThan("xs")]: {
      padding: "3rem 0.5rem",
    },
  },
}));

function RecentlyVisitedCard({ posts, handleClearPosts }) {
  const dispatch = useAppDispatch();
  const { classes } = useStyles();

  const handlePostTileClick = (post) => {
    dispatch(visitPost(post));
    openContextModal({
      modal: "post",
      innerProps: {
        post,
        closeModal: null,
      },
      classNames: {
        modal: classes.modal,
        body: classes.modalBody,
        inner: classes.modalInner,
      },
      withCloseButton: false,
      transition: "slide-right",
      padding: "1rem 0",
      overlayOpacity: 0.65,
      overlayBlur: 3,
    });
  };

  return (
    <>
      <Title color="dimmed" order={2} size={14} sx={{ padding: "0.75rem 0" }}>
        Recently visited
      </Title>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {posts.map((post) => {
          return (
            <PostTile
              key={post.id}
              post={post}
              handlePostTileClick={() => handlePostTileClick(post)}
              variant="condensed"
            >
              {post.title}
            </PostTile>
          );
        })}
      </div>
      <Anchor
        component="button"
        type="button"
        align="right"
        underline={false}
        size={12}
        sx={{ color: "#818384" }}
        onClick={handleClearPosts}
      >
        Clear
      </Anchor>
    </>
  );
}

export default RecentlyVisitedCard;
