import {
  ClickAwayListener,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Popper,
} from "@mui/material";
import { useState } from "react";
import AttachmentTwoToneIcon from "@mui/icons-material/AttachmentTwoTone";
import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import MoodTwoToneIcon from "@mui/icons-material/MoodTwoTone";
import EmojiPicker, { SkinTones } from "emoji-picker-react";

// eslint-disable-next-line react/prop-types
const SendMessage = ({ socket, username, room }) => {
  const [message, setMessage] = useState("");
  const [anchorElEmoji, setAnchorElEmoji] = useState();

  const handleOnEmojiButtonClick = (event) => {
    setAnchorElEmoji(anchorElEmoji ? null : event?.currentTarget);
  };
  const emojiOpen = Boolean(anchorElEmoji);
  const emojiId = emojiOpen ? "simple-popper" : undefined;
  const handleCloseEmoji = () => {
    setAnchorElEmoji(null);
  };

  const handleOnSend = () => {
    if (message !== "") {
      const __createdtime__ = Date.now();
      // eslint-disable-next-line react/prop-types
      socket.emit("send_message", { username, room, message, __createdtime__ });
      setMessage("");
    }
  };

  const handleEnter = (event) => {
    if (event?.key !== "Enter") {
      return;
    }
    handleOnSend();
  };

  const onChange = (event) => {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target.result;
      const __createdtime__ = Date.now();
      // eslint-disable-next-line react/prop-types
      socket.emit("send_image", {
        data: imageData,
        username,
        room,
        __createdtime__,
      });
    };
    reader.readAsDataURL(file);
  };
  // handle emoji
  const onEmojiClick = (emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };

  return (
    <Grid item xs={12}>
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            onChange={onChange}
          />
          <IconButton
            id="raised-button-file"
            size="large"
            aria-label="attachment file"
          >
            <label htmlFor="raised-button-file">
              <AttachmentTwoToneIcon />
            </label>
          </IconButton>

          <IconButton
            ref={anchorElEmoji}
            aria-describedby={emojiId}
            onClick={handleOnEmojiButtonClick}
            size="large"
            aria-label="emoji"
          >
            <MoodTwoToneIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12} sm zeroMinWidth>
          <OutlinedInput
            id="message-send"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleEnter}
            placeholder="Type a Message"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  disableRipple
                  color="primary"
                  onClick={handleOnSend}
                  aria-label="send message"
                >
                  <SendTwoToneIcon />
                </IconButton>
              </InputAdornment>
            }
            aria-describedby="search-helper-text"
            inputProps={{ "aria-label": "weight" }}
          />
        </Grid>
      </Grid>
      <Popper
        id={emojiId}
        open={emojiOpen}
        anchorEl={anchorElEmoji}
        disablePortal
        style={{ zIndex: 1200 }}
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [-20, 20],
            },
          },
        ]}
      >
        <ClickAwayListener onClickAway={handleCloseEmoji}>
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            defaultSkinTone={SkinTones.DARK}
            autoFocusSearch={false}
          />
        </ClickAwayListener>
      </Popper>
    </Grid>
  );
};

export default SendMessage;
