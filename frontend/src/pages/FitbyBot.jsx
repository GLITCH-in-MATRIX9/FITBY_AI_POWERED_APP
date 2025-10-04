import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BASE_API_URL = "https://fitby-fitness-ai-powered-app.onrender.com";

const FitbyAI = () => {
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "👋 Hi! I'm FitbyAI, your fitness assistant. How can I help you achieve your goals today?"
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    messagesContainerRef.current?.scrollTo({ 
      top: messagesContainerRef.current.scrollHeight, 
      behavior: "smooth" 
    });
  }, [messages]);

  const handleSend = async () => {
    const userMessageContent = input.trim();
    if (!userMessageContent || loading) return;

    setMessages(prev => [...prev, { role: "user", content: userMessageContent }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${BASE_API_URL}/api/chat`, {
        message: userMessageContent,
      });
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "⚠️ Oops, something went wrong. This might be a **CORS error** or the backend server is down. Check your network console!" 
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const MessageBubble = ({ role, content }) => (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      {role !== "user" && (
        <div className="flex-shrink-0 mr-3 mt-1 text-[#ed6126] text-xl">
          <FaRobot />
        </div>
      )}
      <div className={`px-4 py-3 max-w-xl text-base shadow-md ${
        role === "user"
          ? "bg-[#ed6126] text-white rounded-t-xl rounded-bl-xl"
          : "bg-gray-100 text-gray-800 rounded-t-xl rounded-br-xl border border-gray-200"
      }`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
      {role === "user" && (
        <div className="flex-shrink-0 ml-3 mt-1 text-gray-500 text-xl">
          <FaUser />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-200 flex">
      <div className="w-full max-w-4xl mx-auto pt-3 px-4">
        <div className="flex flex-col bg-white shadow-2xl rounded-xl overflow-hidden h-[85vh]">
          <div className="bg-[#ed6126] text-white py-4 px-6 font-extrabold text-2xl shadow-lg flex items-center justify-center">
            <FaRobot className="mr-3 text-2xl" />
            Fitby AI Assistant
          </div>

          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} {...msg} />
            ))}
            {loading && (
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3 mt-1 text-[#ed6126] text-xl">
                  <FaRobot />
                </div>
                <div className="px-4 py-3 rounded-xl bg-gray-100 text-gray-500 text-base border border-gray-200">
                  <span className="animate-pulse">FitbyAI is typing...</span>
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={loading}
                placeholder="Ask FitbyAI about workouts, diet, or fitness..."
                className="flex-1 border border-gray-300 rounded-full px-6 py-3 text-base focus:ring-2 focus:ring-[#ed6126] focus:border-transparent outline-none transition"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="ml-4 bg-[#ed6126] text-white p-3 rounded-full hover:bg-black transition disabled:opacity-50"
              >
                <FaPaperPlane className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitbyAI;