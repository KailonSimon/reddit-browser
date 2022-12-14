import { Box, Center, SegmentedControl, Text } from "@mantine/core";
import { EggCracked, Flame, Medal, TrendingUp } from "tabler-icons-react";

const sortingOptions = [
  { value: "hot", title: "Hot", icon: <Flame size={16} /> },
  { value: "top", title: "Top", icon: <Medal size={16} /> },
  { value: "new", title: "New", icon: <EggCracked size={16} /> },
  { value: "rising", title: "Rising", icon: <TrendingUp size={16} /> },
];

function FeedControls({ sorting, setSorting, isRefetching }) {
  return (
    <Box
      sx={(theme) => ({
        marginBottom: "16px",
        background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
        width: "100%",
        maxWidth: "100%",
        border: `1px solid ${
          theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
        }`,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      })}
    >
      <SegmentedControl
        fullWidth
        color="brand"
        size="md"
        radius={4}
        value={sorting}
        onChange={setSorting}
        data={sortingOptions.map((option) => {
          return {
            value: option.value,
            label: (
              <Center>
                {option.icon}
                <Text weight={700} ml={6}>
                  {option.title}
                </Text>
              </Center>
            ),
          };
        })}
        styles={(theme) => ({
          root: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? "transparent"
                : theme.colors.gray[1],
          },
          label: { color: "#fff" },
          labelActive: {
            color: "#1A1A1B !important",
          },
        })}
        variant="default"
        disabled={isRefetching}
      />
    </Box>
  );
}

export default FeedControls;
