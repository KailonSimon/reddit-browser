import { Button } from "@mantine/core";
import PostCard from "./PostCard";
import CommentSection from "./CommentSection";
import { ArrowLeft } from "tabler-icons-react";

export default function PostModal({ context, id, innerProps }) {
  const handleCloseModal = () => {
    innerProps.closeModal();
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
      <PostCard post={innerProps.post} />
      <CommentSection post={innerProps.post} />
    </>
  );
}
