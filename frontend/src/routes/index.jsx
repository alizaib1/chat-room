import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatRoom, HomePage } from "../containers";
import { useState } from "react";
import Layout from "../layout";
import io from "socket.io-client";

const socket = io.connect("http://localhost:4000");

const AppRoutes = () => {
  const [username, setUsername] = useState("");
  const [room] = useState("friends");
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <HomePage
                username={username}
                setUsername={setUsername}
                room={room}
                socket={socket}
              />
            }
          />
          <Route
            path="/chat-room"
            element={
              <ChatRoom username={username} room={room} socket={socket} />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
