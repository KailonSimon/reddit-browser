import { Box, Center, SegmentedControl, Text } from "@mantine/core";

import { EggCracked, Flame, Medal, TrendingUp } from "tabler-icons-react";

function FeedControls({ sorting, setSorting, isRefetching }) {
  return (
    <Box
      sx={(theme) => ({
        marginBottom: "16px",
        background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
        width: 600,
        maxWidth: "100%",
        border: `1px solid ${
          theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
        }`,
        borderRadius: 4,
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      })}
    >
      <SegmentedControl
        fullWidth
        color="brand"
        radius={4}
        label={
          <Text color="#D7DADC" mb={4}>
            Sort By
          </Text>
        }
        value={sorting}
        onChange={setSorting}
        data={[
          {
            value: "hot",
            label: (
              <Center>
                <Flame size={16} />
                <Box ml={6}>Hot</Box>
              </Center>
            ),
          },
          {
            value: "top",
            label: (
              <Center>
                <Medal size={16} />
                <Box ml={6}>Top</Box>
              </Center>
            ),
          },
          {
            value: "new",
            label: (
              <Center>
                <EggCracked size={16} />
                <Box ml={6}>New</Box>
              </Center>
            ),
          },
          {
            value: "rising",
            label: (
              <Center>
                <TrendingUp size={16} />
                <Box ml={6}>Rising</Box>
              </Center>
            ),
          },
        ]}
        styles={(theme) => ({
          root: {
            backgroundColor:
              theme.colorScheme === "dark" ? "#121212" : theme.colors.gray[1],
          },
        })}
        variant="default"
        disabled={isRefetching}
      />
    </Box>
  );
}

export default FeedControls;
