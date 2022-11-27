import { useState } from "react";
import { Image, Text, Tooltip } from "@mantine/core";

function AwardsContainer({ awards }) {
  const [allAwardsShown, setAllAwardsShown] = useState(false);
  return (
    <div
      style={{
        display: "inline-flex",
        padding: "0 2px",
        flexWrap: "wrap",
        verticalAlign: "top",
      }}
    >
      {awards.slice(0, allAwardsShown ? awards.length : 4).map((award) => {
        return (
          <Tooltip
            key={award.id}
            color="dark"
            position="bottom"
            styles={{
              tooltip: {
                padding: "1rem",
                borderRadius: 4,
                maxWidth: 200,

                filter: "drop-shadow(0 0.2rem 0.25rem #000)",
                background:
                  "linear-gradient(to bottom, #59ba12 50px, #1A1A1B 50px)",
              },
            }}
            label={
              <div
                style={{
                  maxWidth: "100%",
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  display: "flex",
                  flexDirection: "column",
                  height: "min-content",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  src={award.resized_icons[3].url}
                  height={award.resized_icons[3].height}
                  width={award.resized_icons[3].width}
                  alt={award.name}
                  mb={16}
                />
                <Text weight={700}>{award.name} Award</Text>
                <Text size="xs">{award.description}</Text>
              </div>
            }
          >
            <span style={{ display: "flex", cursor: "pointer" }}>
              <Image
                src={award.resized_icons[0].url}
                alt={award.name}
                ml={4}
                mr={2}
              />
              <Text
                size="xs"
                color="dimmed"
                weight={300}
                sx={{ whiteSpace: "nowrap" }}
              >
                {award.count > 1 ? award.count : ""}
              </Text>
            </span>
          </Tooltip>
        );
      })}
      {allAwardsShown || awards.length <= 4 ? null : (
        <Text
          color="dimmed"
          size="xs"
          ml={4}
          variant="link"
          sx={{ cursor: "pointer" }}
          onClick={() => setAllAwardsShown(true)}
        >
          & {awards.length - 4} more
        </Text>
      )}
    </div>
  );
}

export default AwardsContainer;
