import { Card, CardContent, Grid, Typography, useTheme } from "@mui/material";
import styles from "./styles.module.css";
import { useState, useEffect, useRef } from "react";
import moment from "moment";

// eslint-disable-next-line react/prop-types
const Messages = ({ socket }) => {
  const [messagesRecieved, setMessagesReceived] = useState([]);
  const messagesColumnRef = useRef(null);
  const theme = useTheme();

  // Runs whenever a socket event is recieved from the server
  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    socket.on("receive_message", (data) => {
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          image: data.data,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

    // Remove event listener on component unmount
    // eslint-disable-next-line react/prop-types
    return () => socket.off("receive_message");
  }, [socket]);

  useEffect(() => {
    // Last 100 messages sent in the chat room (fetched from the db in backend)
    // eslint-disable-next-line react/prop-types
    socket.on("last_100_messages", (last100Messages) => {
      console.log("Last 100 messages:", JSON.parse(last100Messages));
      last100Messages = JSON.parse(last100Messages);
      // Sort these messages by __createdtime__
      last100Messages = sortMessagesByDate(last100Messages);
      setMessagesReceived((state) => [...last100Messages, ...state]);
    });

    // eslint-disable-next-line react/prop-types
    return () => socket.off("last_100_messages");
  }, [socket]);

  // Scroll to the most recent message
  useEffect(() => {
    messagesColumnRef.current.scrollTop =
      messagesColumnRef.current.scrollHeight;
  }, [messagesRecieved]);

  function sortMessagesByDate(messages) {
    return messages.sort(
      (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
    );
  }

  return (
    <div className={styles.messagesColumn} ref={messagesColumnRef}>
      {messagesRecieved.map((msg, i) => (
        <Grid item xs={12} key={i} style={{ marginTop: 5 }}>
          <Grid container spacing={3}>
            <Grid item xs={2} />
            <Grid item xs={10}>
              <Card
                sx={{
                  display: "inline-block",
                  float: "right",
                  bgcolor: "#ede7f6",
                }}
              >
                <CardContent
                  sx={{
                    p: 2,
                    pb: "16px !important",
                    width: "fit-content",
                    ml: "auto",
                  }}
                >
                  <Grid container spacing={1}>
                    <span>{msg.username}</span>
                    <Grid item xs={12}>
                      {msg.message ? (
                        <Typography
                          variant="body2"
                          color={
                            theme.palette.mode === "dark" ? "dark.900" : ""
                          }
                        >
                          {msg.message}
                        </Typography>
                      ) : (
                        <img
                          style={{ height: "100px" }}
                          src={msg.image}
                          alt={msg.__createdtime__}
                          loading="lazy"
                        />
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        align="right"
                        variant="subtitle2"
                        color={theme.palette.mode === "dark" ? "dark.900" : ""}
                      >
                        {moment(msg.__createdtime__).fromNow()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </div>
  );
};

export default Messages;
