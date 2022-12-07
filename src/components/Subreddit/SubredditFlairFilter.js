import { Chip, Title, Button } from "@mantine/core";
import { useState } from "react";

function SubredditFlairFilter({ flairList, setFlairFilter, shownFlair }) {
  const [visibleFlair, setVisibleFlair] = useState(flairList.slice(0, 5));
  return (
    <>
      <Title color="dimmed" order={2} size={14} sx={{ padding: "0.75rem 0" }}>
        Filter by flair
      </Title>
      <Chip.Group value={shownFlair} onChange={setFlairFilter} multiple>
        {visibleFlair.map((flair) => (
          <Chip
            value={flair.text}
            key={flair.id}
            variant="filled"
            styles={(theme) => ({
              label: {
                fontWeight: 500,
                "&[data-variant='filled']": {
                  background: flair.background_color,
                  color:
                    flair.text_color === "light" ? theme.white : theme.black,
                  "&:hover": {
                    opacity: 0.8,
                    background: flair.background_color,
                    color:
                      flair.text_color === "light" ? theme.white : theme.black,
                  },
                },
                "&[data-checked][data-variant='filled']": {
                  background: flair.background_color,
                  color:
                    flair.text_color === "light" ? theme.white : theme.black,
                },
              },
              checkIcon: {
                color: flair.text_color === "light" ? theme.white : theme.black,
              },
            })}
          >
            {flair.text.substring(0, 15)}
          </Chip>
        ))}
      </Chip.Group>
      {flairList.length > 5 ? (
        <Button
          radius={99}
          size="xs"
          variant="subtle"
          sx={(theme) => ({
            color: theme.white,
            width: "min-content",
            marginTop: 12,
          })}
          onClick={
            visibleFlair.length === flairList.length
              ? () => setVisibleFlair(flairList.slice(0, 5))
              : () => setVisibleFlair(flairList)
          }
        >
          See {visibleFlair.length === flairList.length ? "less" : "more"}
        </Button>
      ) : null}
    </>
  );
}

export default SubredditFlairFilter;
