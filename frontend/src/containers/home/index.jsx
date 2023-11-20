import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

// eslint-disable-next-line react/prop-types
const Home = ({ username, setUsername, room, socket }) => {
  const navigate = useNavigate(); // Add this

  const joinRoom = () => {
    if (room !== "" && username !== "") {
      // eslint-disable-next-line react/prop-types
      socket.emit("join_room", { username, room });
    }

    // Redirect to /chat
    navigate("/chat-room", { replace: true });
  };
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>{`<>DevRooms</>`}</h1>
        <input
          className={styles.input}
          placeholder="Username..."
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          className="btn btn-secondary"
          style={{ width: "100%" }}
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;
