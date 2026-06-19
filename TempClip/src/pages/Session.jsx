import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import socket from "../services/socket";
import "./session.css";

export default function Session() {

    const { code } = useParams();
    const navigate = useNavigate();

    const [clipboard, setClipboard] = useState("");
    const [users, setUsers] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let intervalId;
        let cancelled = false;
        let joined = false;

        const joinRoom = () => {
            socket.emit("join-session", code);
            joined = true;
        };

        const fetchSession = async () => {
            try {
                const res = await api.get(`/session/${code}`);
                if (cancelled) return;

                const session = res.data;

                setClipboard(session.clipboardData || "");
                setUsers(session.usersOnline || 0);
                setLoading(false);

                const expiry = new Date(session.expiresAt).getTime();

                const updateTimer = () => {
                    const remaining = Math.max(
                        0,
                        Math.floor((expiry - Date.now()) / 1000)
                    );

                    setTimeLeft(remaining);

                    if (remaining <= 0) {
                        clearInterval(intervalId);
                        window.location.href = "/";
                    }
                };

                updateTimer();
                intervalId = setInterval(updateTimer, 1000);

                if (socket.connected) {
                    joinRoom();
                } else {
                    socket.once("connect", joinRoom);
                }
            } catch (error) {
                if (cancelled) return;
                navigate("/join", { state: { error: "Session not found" } });
            }
        };

        fetchSession();

        const handleClipboardUpdate = (data) => {
            setClipboard(data);
        };

        const handleOnlineUsers = (count) => {
            setUsers(count);
        };

        const handleError = (message) => {
            navigate("/join", { state: { error: message } });
        };

        socket.on("clipboard-update", handleClipboardUpdate);
        socket.on("online-users", handleOnlineUsers);
        socket.on("error-message", handleError);

        return () => {
            cancelled = true;
            if (intervalId) clearInterval(intervalId);
            socket.off("connect", joinRoom);
            socket.off("clipboard-update", handleClipboardUpdate);
            socket.off("online-users", handleOnlineUsers);
            socket.off("error-message", handleError);
            // Only emit leave if the socket actually joined
            if (joined) {
                socket.emit("leave-session", code);
            }
        };
    }, [code, navigate]);

    const handleChange = (e) => {

        const value = e.target.value;

        setClipboard(value);

        socket.emit("clipboard-change", {
            code,
            data: value
        });
    };

    const copyClipboard = () => {
        navigator.clipboard.writeText(clipboard);
    };

    const exitSession = () => {
        navigate("/");
    };

    if (loading) {
        return (
            <div className="session">
                <p>Loading session...</p>
            </div>
        );
    }

    return (
        <div className="session">

            <div className="session-header">

                <div className="session-code">
                    Code: {code}
                </div>

                <div className="online-users">
                    Users Online: {users}
                </div>

                <div className="timer">
                    Time Left:
                    {Math.floor(timeLeft / 60)}:
                    {(timeLeft % 60)
                        .toString()
                        .padStart(2, "0")}
                </div>

            </div>

            <div className="clipboard-container">

                <textarea
                    className="clipboard-textarea"
                    value={clipboard}
                    onChange={handleChange}
                    placeholder="Start typing..."
                />
         

            </div>

            <div className="session-actions">

                <button
                    className="copy-btn"
                    onClick={copyClipboard}
                >
                    Copy Text
                </button>

                <button
                    className="exit-btn"
                    onClick={exitSession}
                >
                    Exit Session
                </button>

            </div>

        </div>
    );
}
