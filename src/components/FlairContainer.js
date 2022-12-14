import Image from "next/image";
import { Badge } from "@mantine/core";
import { isColorDark } from "src/services/Format/Color";

function FlairContainer({ submission, type }) {
  const flair =
    type === "author"
      ? submission.author_flair_richtext
      : submission.link_flair_richtext;
  if (flair?.length) {
    return (
      <Badge
        size={type === "author" ? "xs" : "sm"}
        radius={type === "author" ? 4 : 20}
        onClick={type === "link" ? () => console.log(submission) : null}
        styles={(theme) => ({
          root: {
            width: "min-content",
            padding: "0 4px",
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
        {flair?.map((item, i) =>
          "t" in item ? (
            <span key={i}>{item.t}</span>
          ) : (
            "u" in item && (
              <Image
                height={type === "author" ? 14 : 16}
                width={type === "author" ? 14 : 16}
                key={i}
                src={item.u}
                alt={item.a}
              />
            )
          )
        )}
      </Badge>
    );
  } else {
    return null;
  }
}

export default FlairContainer;
