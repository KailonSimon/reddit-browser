import React from "react";
import { MultiSelect, Select, Text } from "@mantine/core";
import { BrandReddit } from "tabler-icons-react";

function FeedControls({
  subreddits,
  setSubreddits,
  sorting,
  setSorting,
  isRefetching,
}) {
  return (
    <div
      style={{
        marginBottom: "16px",
        background: "#1A1A1B",
        width: 600,
        maxWidth: "100%",
        border: "1px solid #474748",
        borderRadius: 4,
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <MultiSelect
        label={
          <Text color="#D7DADC" mb={4}>
            Select Subreddits
          </Text>
        }
        clearable={false}
        value={subreddits}
        onChange={setSubreddits}
        data={[
          {
            value: "LearnProgramming",
            label: "Learn Programming",
            group: "Programming",
          },
          {
            value: "WebDev",
            label: "Web Development",
            group: "Programming",
          },
          {
            value: "ProgrammerHumor",
            label: "Programmer Humor",
            group: "Programming",
          },
          { value: "WorldNews", label: "World News", group: "News" },
          { value: "Science", label: "Science", group: "News" },
          { value: "Futurology", label: "Futurology", group: "News" },
          { value: "NFL", label: "NFL", group: "Sports" },
          { value: "NBA", label: "NBA", group: "Sports" },
          { value: "Soccer", label: "Soccer", group: "Sports" },
        ]}
        searchable
        nothingFound="No matching subreddits"
        variant="default"
        disabled={isRefetching}
        icon={<BrandReddit />}
      />
      <Select
        label={
          <Text color="#D7DADC" mb={4}>
            Sort By
          </Text>
        }
        value={sorting}
        onChange={setSorting}
        data={[
          { value: "hot", label: "Hot" },
          { value: "best", label: "Best" },
          { value: "top", label: "Top" },
          { value: "new", label: "New" },
          { value: "rising", label: "Rising" },
          { value: "controversial", label: "Controversial" },
        ]}
        variant="default"
        disabled={isRefetching}
      />
    </div>
  );
}

export default FeedControls;
