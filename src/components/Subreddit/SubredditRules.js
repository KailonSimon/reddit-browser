import { Accordion, createStyles, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { getSubredditRules } from "../../../utils";
import { markdown } from "snudown-js";

const useStyles = createStyles((theme) => ({
  container: {
    height: "min-content",
    width: "20rem",
    background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    position: "relative",
    borderRadius: "4px",
    border: `1px solid ${
      theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
    }`,
    color: theme.colorScheme === "dark" ? "#fff" : "#000",

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },
}));

function SubredditRules({ subreddit }) {
  const { classes } = useStyles();
  const [rules, setRules] = useState(null);

  useEffect(() => {
    try {
      getSubredditRules(subreddit.display_name).then((data) => {
        setRules(data.rules);
      });
    } catch (error) {
      console.log(error);
    }
  }, [subreddit]);

  if (!rules) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Title color="dimmed" order={2} size={14} mb={12}>
        {subreddit.display_name_prefixed} rules
      </Title>
      <Accordion
        styles={{
          label: { fontSize: 14 },
          chevron: { marginLeft: 0 },
        }}
      >
        {rules.map((rule, i) => {
          const createMarkup = (text) => {
            return { __html: markdown(text, { target: "_blank" }) };
          };
          return (
            <Accordion.Item value={rule.short_name} key={rule.short_name}>
              <Accordion.Control>
                <Text weight="bold">{`${i + 1}. ${rule.short_name}`}</Text>
              </Accordion.Control>
              <Accordion.Panel>
                {
                  <div
                    dangerouslySetInnerHTML={createMarkup(rule.description)}
                  />
                }
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </div>
  );
}

export default SubredditRules;
