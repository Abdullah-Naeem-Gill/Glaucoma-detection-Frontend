import React, { useState, useRef, useEffect } from "react";

const WS_BASE_URL = "ws://localhost:8000/ws/chat";

const ChatModal = ({ doctor, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const chatMessagesEndRef = useRef(null);
  const wsRef = useRef(null);

  // Get user info from localStorage
  const userType = localStorage.getItem("userType");
  const patientEmail = localStorage.getItem("patient_email");
  const doctorEmail = localStorage.getItem("doctor_email");
  const accessToken = localStorage.getItem("access_token");
  const doctorToken = localStorage.getItem("doctor_token");

  // Determine current user
  const isPatient = userType === "patient";
  const myEmail = isPatient ? patientEmail : doctorEmail;
  const myToken = isPatient ? accessToken : doctorToken;
  // For patient, doctor prop is the doctor; for doctor, doctor prop is the patient
  const otherEmail = doctor?.email;
  const otherName = doctor?.name || doctor?.full_name || "User";

  // Fetch chat history when modal opens
  useEffect(() => {
    if (!myEmail || !otherEmail) return;
    setHistoryLoading(true);
    setHistoryError(null);
    fetch(
      `http://localhost:8000/ws/history/${encodeURIComponent(
        myEmail
      )}/${encodeURIComponent(otherEmail)}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch chat history");
        return res.json();
      })
      .then((data) => {
        setMessages(
          data.map((msg) => ({
            id: msg.id || msg.timestamp + msg.sender_email,
            isMine: msg.sender_email === myEmail,
            text: msg.message,
            timestamp: msg.timestamp,
            sender_email: msg.sender_email,
            role:
              msg.sender_email === myEmail
                ? userType
                : userType === "doctor"
                ? "patient"
                : "doctor",
          }))
        );
      })
      .catch((err) => setHistoryError(err.message || "Error loading history"))
      .finally(() => setHistoryLoading(false));
  }, [myEmail, otherEmail]);

  // WebSocket connection
  useEffect(() => {
    if (!myToken || !myEmail || !otherEmail) {
      setError("Missing user info. Please log in again.");
      return;
    }

    const wsUrl = `${WS_BASE_URL}?token=${myToken}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      const text = event.data;
      const match = text.match(/^(doctor|patient) \(([^)]+)\): (.*)$/);
      if (match) {
        const [, role, senderEmail, msgText] = match;
        const isMine = senderEmail === myEmail;
        const msgObj = {
          id: `live-${Date.now()}-${Math.random()}`,
          isMine,
          text: msgText,
          timestamp: new Date().toISOString(),
          sender_email: senderEmail,
          role: role,
        };
        setMessages((prev) => [...prev, msgObj]);
      }
    };

    ws.onerror = () => {
      setError("WebSocket connection error.");
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
    // Only run once on mount and when user info changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myToken, myEmail, otherEmail]);

  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Optimistically add sent message to messages
  const handleSendMessage = () => {
    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }
    if (!isConnected) {
      setError("Not connected to chat server.");
      return;
    }
    setError(null);
    const msgObj = {
      id: `live-${Date.now()}-${Math.random()}`,
      isMine: true,
      text: message.trim(),
      timestamp: new Date().toISOString(),
      sender_email: myEmail,
      role: userType,
    };
    setMessages((prev) => [...prev, msgObj]);
    try {
      wsRef.current?.send(
        JSON.stringify({
          to: otherEmail,
          message: message.trim(),
        })
      );
      setMessage("");
    } catch (error) {
      setError("Failed to send message.");
      console.error("Send error:", error);
    }
  };

  // Add received messages in real time (no duplicate prevention)
  useEffect(() => {
    if (!wsRef.current) return;
    const ws = wsRef.current;
    ws.onmessage = (event) => {
      const text = event.data;
      const match = text.match(/^(doctor|patient) \(([^)]+)\): (.*)$/);
      if (match) {
        const [, role, senderEmail, msgText] = match;
        const isMine = senderEmail === myEmail;
        const msgObj = {
          id: `live-${Date.now()}-${Math.random()}`,
          isMine,
          text: msgText,
          timestamp: new Date().toISOString(),
          sender_email: senderEmail,
          role: role,
        };
        setMessages((prev) => [...prev, msgObj]);
      }
    };
    // No need to handle confirmation or welcome messages for chatMessages
    // ws.onerror/ws.onclose handled elsewhere
  }, [myEmail]);

  if (!otherName) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading user information...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Close chat"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">
          Chat with {isPatient ? `Dr. ${otherName}` : otherName}
        </h2>

        {/* Connection Status */}
        <div
          className={`mb-2 text-sm ${
            isConnected ? "text-green-600" : "text-red-600"
          }`}
        >
          {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </div>

        {error && (
          <div
            className="mb-4 p-2 bg-red-100 text-red-700 rounded-md"
            role="alert"
          >
            {error}
          </div>
        )}
        <div
          className="border border-gray-300 rounded-md p-4 h-96 max-h-[28rem] overflow-y-scroll mb-4 bg-gray-50"
          style={{ display: "block" }}
        >
          {historyLoading ? (
            <div className="text-gray-500 text-center">
              Loading chat history...
            </div>
          ) : historyError ? (
            <div className="text-red-600 text-center">{historyError}</div>
          ) : messages.length === 0 ? (
            <p className="text-gray-600">
              Start your conversation with{" "}
              {isPatient ? `Dr. ${otherName}` : otherName}!
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 ${
                  msg.isMine ? "flex justify-end" : "flex justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-2 rounded-lg ${
                    msg.isMine
                      ? msg.id.startsWith("live-")
                        ? "bg-blue-500 text-white"
                        : "bg-blue-100 text-blue-900"
                      : msg.id.startsWith("live-")
                      ? "bg-gray-200 text-gray-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-xs font-semibold">
                    {msg.isMine
                      ? "You"
                      : isPatient
                      ? `Dr. ${otherName}`
                      : otherName}
                  </p>
                  {msg.text && <p className="text-sm">{String(msg.text)}</p>}
                  <span className="text-xs text-opacity-75 block text-right mt-1">
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={chatMessagesEndRef} />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={!isConnected}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition disabled:bg-blue-300"
            onClick={handleSendMessage}
            disabled={!isConnected}
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
