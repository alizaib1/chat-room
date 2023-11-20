import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import styles from "./styles.module.css";
import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AvatarStatus from "./avatar-status";

// eslint-disable-next-line react/prop-types
const RoomAndUsers = ({ socket, username, room }) => {
  const theme = useTheme();
  const [roomUsers, setRoomUsers] = useState([]);
  const matchDownLG = useMediaQuery(theme.breakpoints.down("lg"));

  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    socket.on("chatroom_users", (data) => {
      console.log(data);
      setRoomUsers(data);
    });

    // eslint-disable-next-line react/prop-types
    return () => socket.off("chatroom_users");
  }, [socket]);

  const leaveRoom = () => {
    const __createdtime__ = Date.now();
    // eslint-disable-next-line react/prop-types
    socket.emit("leave_room", { username, room, __createdtime__ });
    // Redirect to home page
    navigate("/", { replace: true });
  };

  function stringAvatar(name) {
    return `${name.split(" ")[0]}`;
  }

  return (
    <div className={styles.roomAndUsersColumn}>
      <h2 className={styles.roomTitle}>{room}</h2>

      <div>
        {roomUsers.length > 0 && <h5 className={styles.usersTitle}>Users:</h5>}
        <Box
          style={{
            overflowX: "hidden",
            height: matchDownLG ? "calc(100vh - 190px)" : "calc(100vh - 445px)",
            minHeight: matchDownLG ? 0 : 520,
          }}
        >
          <Box sx={{ p: 3, pt: 0 }}>
            <List component="nav">
              {roomUsers?.map((user) => (
                <Fragment key={user.id}>
                  <ListItemButton onClick={() => {}}>
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        badgeContent={
                          <AvatarStatus status={user.online_status} />
                        }
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                      >
                        <Avatar
                          alt={user.username}
                          src={user.avatar || stringAvatar(user.username)}
                        />
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Grid
                          container
                          alignItems="center"
                          spacing={1}
                          component="span"
                        >
                          <Grid item xs zeroMinWidth component="span">
                            <Typography
                              variant="h5"
                              color="inherit"
                              component="span"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                display: "block",
                              }}
                            >
                              {user.username}
                            </Typography>
                          </Grid>
                          <Grid item component="span">
                            <Typography component="span" variant="subtitle2">
                              user.lastMessage
                            </Typography>
                          </Grid>
                        </Grid>
                      }
                      secondary={
                        <Grid
                          container
                          alignItems="center"
                          spacing={1}
                          component="span"
                        >
                          <Grid item xs zeroMinWidth component="span">
                            <Typography
                              variant="caption"
                              component="span"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                display: "block",
                              }}
                            >
                              {user.status}
                            </Typography>
                          </Grid>
                        </Grid>
                      }
                    />
                  </ListItemButton>
                  <Divider />
                </Fragment>
              ))}
            </List>
          </Box>
        </Box>
      </div>

      <Button variant="outlined" startIcon={<DeleteIcon />} onClick={leaveRoom}>
        Leave
      </Button>
    </div>
  );
};

export default RoomAndUsers;
