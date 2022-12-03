import { Badge } from "@mantine/core";
import { isColorDark } from "../../utils";
import Image from "next/image";

function FlairContainer({ submission, type }) {
  if (type === "author" && submission.author_flair_richtext?.length) {
    return (
      <Badge
        size="xs"
        variant="filled"
        color="gray"
        radius={4}
        styles={{
          inner: { display: "flex", gap: "4px", color: "#fff" },
          root: { padding: "0 4px", width: "min-content" },
        }}
      >
        {submission.author_flair_richtext?.map((item, i) => {
          if ("t" in item) {
            return item.t;
          } else if ("u" in item) {
            return (
              <Image height={14} width={14} key={i} src={item.u} alt={item.a} />
            );
          }
        })}
      </Badge>
    );
  } else if (type === "link" && submission.link_flair_richtext?.length) {
    return (
      <Badge
        size="md"
        radius={20}
        onClick={() => console.log(submission)}
        styles={(theme) => ({
          root: {
            fontSize: 12,
            color: submission.link_flair_background_color
              ? isColorDark(submission.link_flair_background_color)
                ? "#fff"
                : "#000"
              : "#fff",
            background:
              submission.link_flair_background_color || theme.colors.gray[8],
          },
          inner: { display: "flex", gap: "4px" },
        })}
      >
        {submission.link_flair_richtext?.map((item, i) => {
          if ("t" in item) {
            return <span key={i}>{item.t}</span>;
          } else if ("u" in item) {
            return (
              <Image height={16} width={16} key={i} src={item.u} alt={item.a} />
            );
          }
        })}
      </Badge>
    );
  } else {
    return null;
  }
}

export default FlairContainer;
