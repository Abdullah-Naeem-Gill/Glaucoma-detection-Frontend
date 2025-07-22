import React, { useState, useRef, useEffect } from "react";

const WS_BASE_URL = "ws://localhost:8000/ws/chat";

const ChatModal = ({ doctor, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSendingImage, setIsSendingImage] = useState(false);
  const chatMessagesEndRef = useRef(null);
  const wsRef = useRef(null);
  const fileInputRef = useRef(null);

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

  // Handle image selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size too large. Maximum size is 5MB.");
      return;
    }

    setSelectedImage(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Convert image to base64
  const imageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

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
            image_data: msg.image_data,
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
      try {
        const data = JSON.parse(event.data);

        if (data.type === "received" || data.type === "sent") {
          const msgObj = {
            id: `live-${Date.now()}-${Math.random()}`,
            isMine: data.type === "sent",
            text: data.message,
            image_data: data.image_data,
            timestamp: new Date().toISOString(),
            sender_email: data.sender_email,
            role:
              data.sender_email === myEmail
                ? userType
                : userType === "doctor"
                ? "patient"
                : "doctor",
          };
          messagesRef.current = [...messagesRef.current, msgObj];
          setMessages(messagesRef.current);
        } else if (data.type === "error") {
          setError(data.message);
        }
      } catch {
        // Handle legacy text format messages
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
          messagesRef.current = [...messagesRef.current, msgObj];
          setMessages(messagesRef.current);
        }
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

  // Send message or image
  const handleSendMessage = async () => {
    if (!message.trim() && !selectedImage) {
      setError("Please enter a message or select an image.");
      return;
    }
    if (!isConnected) {
      setError("Not connected to chat server.");
      return;
    }

    setError(null);
    setIsSendingImage(true);

    try {
      let imageData = null;
      if (selectedImage) {
        imageData = await imageToBase64(selectedImage);
      }

      const msgObj = {
        id: `live-${Date.now()}-${Math.random()}`,
        isMine: true,
        text: message.trim(),
        image_data: imageData,
        timestamp: new Date().toISOString(),
        sender_email: myEmail,
        role: userType,
      };
      setMessages((prev) => [...prev, msgObj]);

      // Send to WebSocket
      wsRef.current?.send(
        JSON.stringify({
          to: otherEmail,
          message: message.trim(),
          image_data: imageData,
        })
      );

      // Clear form
      setMessage("");
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setError("Failed to send message.");
      console.error("Send error:", error);
    } finally {
      setIsSendingImage(false);
    }
  };

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
                  {msg.image_data && (
                    <div className="mt-2">
                      <img
                        src={`data:image/jpeg;base64,${msg.image_data}`}
                        alt="Shared image"
                        className="max-w-full h-auto rounded-md"
                        style={{ maxHeight: "200px" }}
                      />
                    </div>
                  )}
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

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-4 relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full h-auto rounded-md"
              style={{ maxHeight: "150px" }}
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex items-center space-x-2">
          {/* Image Upload Button */}
          <button
            className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition disabled:bg-gray-300"
            onClick={() => fileInputRef.current?.click()}
            disabled={!isConnected}
            aria-label="Upload image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

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
            disabled={!isConnected || isSendingImage}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition disabled:bg-blue-300"
            onClick={handleSendMessage}
            disabled={!isConnected || isSendingImage}
            aria-label="Send message"
          >
            {isSendingImage ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatModal;
