import { Badge, Image } from "@mantine/core";

function FlairContainer({ submission }) {
  if (submission.author_flair_richtext?.length > 0) {
    return (
      <Badge
        size="sm"
        variant="filled"
        color="gray"
        radius={4}
        styles={{
          inner: { display: "flex", gap: "4px", color: "#fff" },
          root: { padding: "0 4px", width: "min-content" },
        }}
      >
        {submission.author_flair_richtext?.map((item) => {
          if ("t" in item) {
            return item.t;
          } else if ("u" in item) {
            return (
              <Image
                height={14}
                width={14}
                fit="contain"
                key={item.u}
                src={item.u}
                alt={item.a}
              />
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
