import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import "./code.css"

export default function Code() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("create");
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);
  const inputsRef = useRef([]);
  const DIGIT_COUNT = 6;
  const [digits, setDigits] = useState(Array(DIGIT_COUNT).fill(""));

  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
      setActiveTab("join");
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const createSession = async () => {
    try {
      const { data } = await api.post("/session/create");
      navigate(`/session/${data.code}`);
    } catch {
      setError("Unable to create section. Please try again.");
      setActiveTab("create");
    }
  };

  const joinSession = async () => {
    const code = digits.join("");
    if (code.length !== DIGIT_COUNT || joining) return;

    setJoining(true);
    setError("");

    try {
      await api.post("/session/join", { code });
      navigate(`/session/${code}`);
    } catch (err) {
      const message = err.response?.data?.message;

      if (err.response?.status === 404) {
        setError(message || "Section not found");
      } else if (message) {
        setError(message);
      } else {
        setError("Unable to connect to server. Please try again.");
      }
    } finally {
      setJoining(false);
    }
  };

  const updateDigits = (next) => {
    setDigits(next);
    if (error) setError("");
  };

  return (
    <>

      <div className="code-container">

        <div className="tabs-box">
          <div className="radio-inputs">
            <label className="radio">
              <input
                type="radio"
                name="radio"
                checked={activeTab === "create"}
                onChange={() => setActiveTab("create")}
              />
              <span className="name">Create</span>
            </label>

            <label className="radio">
              <input
                type="radio"
                name="radio"
                checked={activeTab === "join"}
                onChange={() => setActiveTab("join")}
              />
              <span className="name">Join</span>
            </label>
          </div>
        </div>

        {activeTab === "create" && (
          <div className="create-section">
            <button className="start-btn" onClick={createSession}>
              Start Sharing
            </button>
          </div>
        )}

        {activeTab === "join" && (
          <div className="join-section">
            <div className="opt-box" onPaste={(e) => {
              e.preventDefault();
              const paste = (e.clipboardData || window.clipboardData).getData('text') || '';
              const only = paste.replace(/\D/g, '').slice(0, DIGIT_COUNT);
              const next = Array(DIGIT_COUNT).fill('');
              for (let i = 0; i < only.length; i++) next[i] = only[i];
              updateDigits(next);
              const focusIdx = Math.min(only.length, DIGIT_COUNT - 1);
              setTimeout(() => inputsRef.current[focusIdx]?.focus(), 0);
            }}>
              {Array.from({ length: DIGIT_COUNT }).map((_, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className="digit"
                  value={digits[i]}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(-1);
                    const next = [...digits];
                    next[i] = val;
                    updateDigits(next);
                    if (val && i < DIGIT_COUNT - 1) inputsRef.current[i + 1]?.focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace') {
                      e.preventDefault();
                      const next = [...digits];
                      if (next[i]) {
                        next[i] = '';
                        updateDigits(next);
                      } else if (i > 0) {
                        inputsRef.current[i - 1]?.focus();
                        next[i - 1] = '';
                        updateDigits(next);
                      }
                    } else if (e.key === 'ArrowLeft' && i > 0) {
                      inputsRef.current[i - 1]?.focus();
                    } else if (e.key === 'ArrowRight' && i < DIGIT_COUNT - 1) {
                      inputsRef.current[i + 1]?.focus();
                    } else if (e.key === 'Enter') {
                      joinSession();
                    }
                  }}
                />
              ))}
            </div>

            {error && <p className="join-error">{error}</p>}

            <button
              className="join-btn"
              onClick={joinSession}
              disabled={joining}
            >
              {joining ? "Checking..." : "Join Session"}
            </button>
          </div>
        )}

      </div>

    </>
  );
}
