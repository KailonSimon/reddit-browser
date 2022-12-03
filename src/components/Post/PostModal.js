import { Button, createStyles } from "@mantine/core";
import PostCard from "./PostCard";
import CommentSection from "../Comment/CommentSection";
import { ArrowLeft } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  container: {
    background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
    border: `1px solid ${
      theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
    }`,
    borderRadius: 4,
  },
}));

export default function PostModal({ context, id, innerProps }) {
  const { classes } = useStyles();
  const handleCloseModal = () => {
    if (innerProps.closeModal !== null) {
      innerProps.closeModal();
    }
    context.closeModal(id);
  };
  return (
    <>
      <Button
        variant="subtle"
        leftIcon={<ArrowLeft />}
        onClick={handleCloseModal}
      >
        Return to feed
      </Button>

      <div className={classes.container}>
        <PostCard post={innerProps.post} />
        <CommentSection post={innerProps.post} />
      </div>
    </>
  );
}
