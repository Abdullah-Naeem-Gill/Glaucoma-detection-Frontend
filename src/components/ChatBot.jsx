import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Toggle chatbot visibility
  const chatEndRef = useRef(null); // Reference for scrolling to the latest message
  const chatContainerRef = useRef(null); // Reference for the chat container to handle scroll

  useEffect(() => {
    // Scroll to the latest message when chatHistory changes
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return; // Prevent empty message

    // Add user's message to chat history
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: "user", text: message },
    ]);
    setIsLoading(true); // Show loading state
    setMessage(""); // Clear input field

    try {
      const response = await axios.post("http://localhost:5000/predict", {
        message: message,
      });

      // Add bot's response to chat history
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: "bot", text: response.data.answer },
      ]);
    } catch (error) {
      console.error("Error sending message", error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  const handleKeyDown = (e) => {
    // Send message when Enter key is pressed
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div>
      {/* Chatbot button */}
      {!isOpen && (
        <button
          className="fixed bottom-5 right-5 bg-blue-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 z-50"
          onClick={() => setIsOpen(true)}
        >
          Chat with AI
        </button>
      )}

      {/* Chatbot UI */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 bg-white shadow-lg rounded-lg flex flex-col z-50">
          <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h2 className="text-lg font-semibold">ChatBot</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xl font-bold text-white"
            >
              X
            </button>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 bg-gray-50"
            style={{ maxHeight: "300px" }} // Set a max height to prevent overflowing the screen
          >
            <div className="space-y-4">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 max-w-xs rounded-lg ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="text-center text-gray-500">Typing...</div>
              )}
            </div>
            {/* Scroll reference to keep scrolled to the bottom */}
            <div ref={chatEndRef}></div>
          </div>

          <div className="flex items-center p-4 border-t border-gray-300">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown} // Send message on Enter key press
              placeholder="Type your message"
              className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
