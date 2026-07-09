import { RootState } from "@/redux/store";
import axios from "axios";
import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
interface RideChatProps {
  currentRole: "user" | "driver";
  bookingId: string;
  userName?: string;
  driverName?: string;
}

const RideChat = ({
  currentRole,
  bookingId,
  userName = "",
  driverName = "",
}: RideChatProps) => {
  const otherName = currentRole == "user" ? driverName : userName;
  const myName = currentRole == "user" ? userName : driverName;
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState("");
  const [text, setText] = useState("");
  const { userData } = useSelector((state: RootState) => state.user);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showAI, setShowAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const avatarLetter = otherName?.charAt(0)?.toUpperCase() || "?";
  const ai = async () => {
    try {
      const { data } = await axios.post("/api/chat/ai-suggestions", {
        role: currentRole,
        lastMessage: lastMessage,
      });
      const cleaned = data
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const jsonData = JSON.parse(cleaned);

      setSuggestions(jsonData.suggestions);
    } catch (err) {
      console.log(err);
    }
  };
  const sendMsg = async () => {
    try {
      const { data } = await axios.post("/api/chat/send", {
        sender: currentRole,
        text,
        bookingId,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllMsgs = async () => {
    try {
      const { data } = await axios.post("/api/chat/get-all", {
        bookingId,
      });
      console.log(data);
      setMessages(data);
      setLastMessage(data[0]);
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };
  useEffect(() => {
    if (bookingId) {
      getAllMsgs();
    }
  }, [bookingId]);
  useEffect(() => {
    if (!lastMessage) return;

    ai();
  }, [lastMessage]);
  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#090909] text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/5 blur-[140px]" />
        <div className="absolute bottom-0 -right-32 h-96 w-96 rounded-full bg-zinc-700/10 blur-[180px]" />
      </div>

      <div className="relative flex h-full flex-col">
        {/* Header */}

        <div className="border-b border-zinc-800/70 bg-black/60 backdrop-blur-xl">
          <div className="flex items-center gap-4 px-6 py-5">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-700 to-black text-lg font-bold ring-1 ring-zinc-700">
                {avatarLetter}
              </div>

              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#090909] bg-emerald-400" />
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold tracking-wide">
                {otherName}
              </h2>

              <p className="text-xs text-emerald-400">Online</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowAI(!showAI);

                if (!showAI) ai();
              }}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-semibold transition hover:bg-white hover:text-black"
            >
              AI Reply
            </motion.button>
          </div>
        </div>

        {/* Messages */}

        <div
          className="flex-1 overflow-y-auto px-5 py-6"
          style={{
            scrollbarWidth: "none",
          }}
        >
          <style>{`div::-webkit-scrollbar{display:none}`}</style>

          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
                <Send size={34} />
              </div>

              <h2 className="mt-6 text-xl font-semibold">No Messages Yet</h2>

              <p className="mt-2 text-sm text-zinc-500">
                Start your conversation.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m, index) => {
                const isMine = m.sender === currentRole;

                return (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[78%] rounded-3xl px-5 py-3 text-sm leading-6 shadow-xl ${
                        isMine
                          ? "rounded-br-md bg-white text-black"
                          : "rounded-bl-md border border-zinc-700 bg-zinc-900 text-zinc-100"
                      }`}
                    >
                      {m.text}
                    </div>
                  </motion.div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* AI */}

        {showAI && (
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="border-t border-zinc-800 bg-[#111111] p-4"
          >
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Suggested Replies
            </h3>

            {aiLoading ? (
              <div className="text-sm text-zinc-400">Generating...</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((item, index) => (
                  <motion.button
                    whileHover={{
                      scale: 1.04,
                    }}
                    whileTap={{
                      scale: 0.96,
                    }}
                    key={index}
                    onClick={() => setText(item)}
                    className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white hover:text-black"
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Input */}

        <div className="border-t border-zinc-800 bg-black/70 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMsg();
                  setText("");
                }
              }}
              placeholder="Type your message..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
            />

            <motion.button
              whileHover={{
                scale: 1.06,
              }}
              whileTap={{
                scale: 0.9,
              }}
              disabled={!text.trim()}
              onClick={() => {
                sendMsg();
                setText("");
              }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black shadow-lg transition disabled:opacity-30"
            >
              <Send size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideChat;
