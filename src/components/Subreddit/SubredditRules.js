import { useEffect, useState } from "react";
import { Accordion, Text, Title } from "@mantine/core";
import { getSubredditRules } from "src/services/Subreddit/client";
import { markdown } from "snudown-js";

function SubredditRules({ subreddit }) {
  const [rules, setRules] = useState(null);

  useEffect(() => {
    try {
      getSubredditRules(subreddit.display_name).then((data) => {
        setRules(data.rules);
      });
    } catch (error) {
      console.log(error);
    }
    console.log(subreddit);
  }, [subreddit]);

  if (!rules) {
    return null;
  }

  return (
    <>
      <Title color="dimmed" order={2} size={14} sx={{ padding: "0.75rem 0" }}>
        {subreddit.display_name_prefixed} Rules
      </Title>
      <Accordion
        styles={(theme) => ({
          label: { fontSize: 14 },
          chevron: { marginLeft: 0 },
          item: {
            border: "inherit",
            ":not(:last-child)": {
              borderBottom: `1px solid ${theme.colors.gray[8]}`,
            },
          },
        })}
      >
        {rules.length ? (
          rules.map((rule, i) => {
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
          })
        ) : (
          <Text color="dimmed">{"There's nothing here..."}</Text>
        )}
      </Accordion>
    </>
  );
}

export default SubredditRules;
