import { Box, Menu, Button, createStyles, ActionIcon } from "@mantine/core";
import numeral from "numeral";
import { useClipboard, useMediaQuery } from "@mantine/hooks";
import {
  BookmarkOff,
  ClipboardCopy,
  Dots,
  Eye,
  EyeOff,
  Link,
} from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { Messages, Share, Bookmark } from "tabler-icons-react";
import { useAppDispatch } from "src/store/store";
import { saveSubmission, hideSubmission } from "src/store/DemoUserSlice";
import { useSelector } from "react-redux";
import { selectDemoUser } from "src/store/DemoUserSlice";
import SubmissionVotingControls from "./SubmissionVotingControls";

const useStyles = createStyles((theme) => ({
  button: {
    padding: 8,
    background: "transparent",
    color: theme.colorScheme === "dark" ? "#909296" : theme.black,
    "&:hover": {
      background: "rgba(52, 58, 64, 0.2)",
    },
  },
  buttonLeftIcon: { marginRight: 6 },
}));

export default function SubmissionMenu({
  type,
  submission,
  handleCommentButtonClick,
}) {
  const { classes } = useStyles();
  const clipboard = useClipboard({ timeout: 500 });
  const isMobile = useMediaQuery("(max-width: 700px)");
  const dispatch = useAppDispatch();
  const { savedSubmissions, hiddenSubmissions } = useSelector(selectDemoUser);
  const isSaved = savedSubmissions.some(
    (savedSubmission) => submission.id === savedSubmission.id
  );
  const isHidden = hiddenSubmissions.some(
    (hiddenSubmission) => submission.id === hiddenSubmission.id
  );

  const handleCopy = (text) => {
    const maxLength = 20;
    clipboard.copy(text);
    showNotification({
      title: "Copied successfully!",
      message: `You copied: ${
        text.length > maxLength ? text.substr(0, maxLength) + "..." : text
      }`,
    });
  };

  const handleSaveSubmission = () => {
    dispatch(saveSubmission(submission));

    showNotification({
      title: `${type[0].toUpperCase()}${type.slice(1, type.length)} ${
        isSaved ? "un" : ""
      }saved successfully!`,
    });
  };

  const handleHideSubmission = () => {
    dispatch(hideSubmission(submission));

    showNotification({
      title: `${type[0].toUpperCase()}${type.slice(1, type.length)} ${
        isHidden ? "un" : ""
      }hidden successfully.`,
    });
  };

  if (type === "post") {
    return (
      <Box
        sx={{
          marginTop: "4px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {isMobile ? (
          <SubmissionVotingControls type="horizontal" submission={submission} />
        ) : null}
        <Button
          size="xs"
          classNames={{
            root: classes.button,
            leftIcon: classes.buttonLeftIcon,
          }}
          radius={4}
          leftIcon={<Messages size={20} />}
          onClick={handleCommentButtonClick}
        >
          {numeral(submission.num_comments).format("0.[0]a")}{" "}
          {`comment${submission.num_comments === 1 ? "" : "s"}`}
        </Button>

        {isMobile ? (
          <Menu
            shadow="md"
            width={200}
            styles={{ dropdown: { padding: 0 }, itemLabel: { fontSize: 14 } }}
          >
            <Menu.Target>
              <ActionIcon radius={4}>
                <Dots color={"#818384"} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown sx={{ padding: 0 }}>
              <Menu.Item
                icon={<ClipboardCopy />}
                onClick={() => handleCopy(submission.title)}
              >
                Copy Title
              </Menu.Item>
              <Menu.Item
                icon={<Link />}
                onClick={() =>
                  handleCopy(
                    `${window.location.origin}/${type}/${submission.id}`
                  )
                }
              >
                Copy Link
              </Menu.Item>
              <Menu.Item
                icon={
                  isSaved ? <BookmarkOff size={20} /> : <Bookmark size={20} />
                }
                onClick={handleSaveSubmission}
              >
                {isSaved ? "Unsave" : "Save"}
              </Menu.Item>
              <Menu.Item
                icon={isHidden ? <EyeOff size={20} /> : <Eye size={20} />}
                onClick={handleHideSubmission}
              >
                {isHidden ? "Unhide" : "Hide"}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <>
            <Menu
              shadow="md"
              width={"8rem"}
              styles={{ dropdown: { padding: 0 }, itemLabel: { fontSize: 14 } }}
            >
              <Menu.Target>
                <Button
                  size="xs"
                  radius={4}
                  classNames={{
                    root: classes.button,
                    leftIcon: classes.buttonLeftIcon,
                  }}
                  leftIcon={<Share size={20} />}
                >
                  Share
                </Button>
              </Menu.Target>
              <Menu.Dropdown sx={{ padding: 0 }}>
                <Menu.Item
                  icon={<ClipboardCopy />}
                  onClick={() => handleCopy(submission.title)}
                >
                  Copy Title
                </Menu.Item>
                <Menu.Item
                  icon={<Link />}
                  onClick={() =>
                    handleCopy(
                      `${window.location.origin}/${type}/${submission.id}`
                    )
                  }
                >
                  Copy Link
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Button
              size="xs"
              classNames={{
                root: classes.button,
                leftIcon: classes.buttonLeftIcon,
              }}
              radius={4}
              leftIcon={
                isSaved ? <BookmarkOff size={20} /> : <Bookmark size={20} />
              }
              onClick={handleSaveSubmission}
            >
              {isSaved ? "Unsave" : "Save"}
            </Button>
            <Button
              size="xs"
              classNames={{
                root: classes.button,
                leftIcon: classes.buttonLeftIcon,
              }}
              radius={4}
              leftIcon={isHidden ? <EyeOff size={20} /> : <Eye size={20} />}
              onClick={handleHideSubmission}
            >
              {isHidden ? "Unhide" : "Hide"}
            </Button>{" "}
          </>
        )}
      </Box>
    );
  } else if (type === "comment") {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Menu
          shadow="md"
          width={"8rem"}
          styles={{ dropdown: { padding: 0 }, itemLabel: { fontSize: 14 } }}
        >
          <Menu.Target>
            <Button
              size="xs"
              radius={4}
              classNames={{
                root: classes.button,
                leftIcon: classes.buttonLeftIcon,
              }}
            >
              Share
            </Button>
          </Menu.Target>
          <Menu.Dropdown sx={{ padding: 0 }}>
            <Menu.Item
              icon={<ClipboardCopy />}
              onClick={() => handleCopy(submission.body)}
            >
              Copy Text
            </Menu.Item>
            <Menu.Item
              icon={<Link />}
              onClick={() =>
                handleCopy(`${window.location.origin}/${type}/${submission.id}`)
              }
            >
              Copy Link
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <Button
          size="xs"
          classNames={{
            root: classes.button,
            leftIcon: classes.buttonLeftIcon,
          }}
          radius={4}
          leftIcon={
            isSaved ? <BookmarkOff size={20} /> : <Bookmark size={20} />
          }
          onClick={handleSaveSubmission}
        >
          {isSaved ? "Unsave" : "Save"}
        </Button>
      </Box>
    );
  } else {
    return null;
  }
}
