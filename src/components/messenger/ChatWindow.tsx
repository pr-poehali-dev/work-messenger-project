import { useState, useRef, useEffect } from "react";
import { Chat, Contact, CallType, Message } from "@/pages/Index";
import Icon from "@/components/ui/icon";
import StatusDot from "./StatusDot";

interface Props {
  chat: Chat;
  me: Contact;
  onSend: (text: string) => void;
  onCall: (type: CallType, contact: Contact) => void;
  onBack: () => void;
  onReact: (msgId: number, emoji: string) => void;
}

const STATUS_LABEL = { online: "В сети", away: "Не активен", offline: "Не в сети" };
const AVATAR_COLORS = [
  "hsl(222, 60%, 35%)", "hsl(200, 60%, 35%)", "hsl(260, 50%, 40%)",
  "hsl(180, 50%, 32%)", "hsl(240, 55%, 38%)", "hsl(210, 65%, 32%)",
  "hsl(190, 55%, 30%)", "hsl(230, 50%, 38%)",
];
const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

export default function ChatWindow({ chat, me, onSend, onCall, onBack, onReact }: Props) {
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [reactionFor, setReactionFor] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const color = AVATAR_COLORS[chat.contact.id % AVATAR_COLORS.length];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  // Симуляция "печатает..." когда собеседник онлайн
  useEffect(() => {
    if (chat.contact.status !== "online") return;
    const last = chat.messages[chat.messages.length - 1];
    if (!last || last.outgoing) return;
    const t = setTimeout(() => setTyping(false), 3000);
    return () => clearTimeout(t);
  }, [chat.messages, chat.contact.status]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    if (e.target.value && chat.contact.status === "online") {
      typingTimer.current = setTimeout(() => setTyping(true), 800);
    } else {
      setTyping(false);
    }
  };

  const send = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
    setTyping(false);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    // Ответ собеседника
    if (chat.contact.status === "online") {
      setTyping(true);
      setTimeout(() => setTyping(false), 2500);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div
      className="flex flex-col w-full h-full"
      style={{ background: "hsl(220, 25%, 97%)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-3 py-3 border-b flex-shrink-0"
        style={{ background: "#fff", borderColor: "hsl(220, 20%, 91%)" }}
      >
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center -ml-1 transition-all"
          style={{ color: "hsl(210, 85%, 50%)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "hsl(210, 85%, 95%)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <Icon name="ChevronLeft" size={22} />
        </button>

        <div className="relative flex-shrink-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: color }}
          >
            {chat.contact.initials}
          </div>
          <StatusDot status={chat.contact.status} size="sm" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight" style={{ color: "hsl(220, 30%, 8%)" }}>
            {chat.contact.name}
          </p>
          <p className="text-[11px] leading-tight transition-all duration-300" style={{ color: typing ? "hsl(210, 85%, 50%)" : "hsl(220, 15%, 55%)" }}>
            {typing ? "печатает..." : STATUS_LABEL[chat.contact.status]}
          </p>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onCall("audio", chat.contact)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{ color: "hsl(210, 85%, 50%)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "hsl(210, 85%, 95%)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <Icon name="Phone" size={18} />
          </button>
          <button
            onClick={() => onCall("video", chat.contact)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{ color: "hsl(210, 85%, 50%)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "hsl(210, 85%, 95%)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <Icon name="Video" size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1"
        onClick={() => setReactionFor(null)}
      >
        {chat.messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: color }}
            >
              {chat.contact.initials}
            </div>
            <p className="font-semibold" style={{ color: "hsl(220, 30%, 15%)" }}>{chat.contact.name}</p>
            <p className="text-sm text-center max-w-xs" style={{ color: "hsl(220, 15%, 55%)" }}>
              {chat.contact.role} · {chat.contact.department}
            </p>
            <p className="text-xs mt-2 px-4 py-2 rounded-full" style={{ background: "hsl(220, 20%, 92%)", color: "hsl(220, 15%, 50%)" }}>
              Начало диалога
            </p>
          </div>
        )}

        {chat.messages.map((msg, i) => {
          const isFirst = i === 0 || chat.messages[i - 1].outgoing !== msg.outgoing;
          const isLast = i === chat.messages.length - 1 || chat.messages[i + 1].outgoing !== msg.outgoing;
          const showReactions = reactionFor === msg.id;

          return (
            <div key={msg.id} className={`flex ${msg.outgoing ? "justify-end" : "justify-start"} relative`} style={{ marginTop: isFirst ? "6px" : "1px" }}>
              {/* Reaction popup */}
              {showReactions && (
                <div
                  className={`absolute ${msg.outgoing ? "right-0" : "left-0"} -top-10 z-10 flex items-center gap-1 px-2 py-1.5 rounded-2xl shadow-lg animate-scale-in`}
                  style={{ background: "#fff", border: "1px solid hsl(220,20%,90%)" }}
                  onClick={e => e.stopPropagation()}
                >
                  {REACTIONS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => { onReact(msg.id, emoji); setReactionFor(null); }}
                      className="text-lg hover:scale-125 transition-transform duration-100"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              <div
                className={`max-w-[75%] flex flex-col ${msg.outgoing ? "items-end" : "items-start"}`}
              >
                <div
                  className="px-3.5 py-2 text-sm leading-relaxed cursor-pointer select-text"
                  style={{
                    background: msg.outgoing ? "hsl(210, 85%, 55%)" : "#fff",
                    color: msg.outgoing ? "#fff" : "hsl(220, 30%, 10%)",
                    borderRadius: msg.outgoing
                      ? `18px 18px ${isLast ? "4px" : "18px"} 18px`
                      : `18px 18px 18px ${isLast ? "4px" : "18px"}`,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                  }}
                  onDoubleClick={() => setReactionFor(msg.id)}
                  title="Дважды нажмите для реакции"
                >
                  {msg.text}
                </div>

                {/* Reactions display */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div
                    className="flex gap-0.5 mt-0.5 px-1.5 py-0.5 rounded-full text-xs cursor-pointer"
                    style={{ background: "#fff", border: "1px solid hsl(220,20%,90%)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                    onClick={() => setReactionFor(msg.id)}
                  >
                    {[...new Set(msg.reactions)].map(r => (
                      <span key={r}>{r}</span>
                    ))}
                    {msg.reactions.length > 1 && (
                      <span style={{ color: "hsl(220, 15%, 50%)" }}>{msg.reactions.length}</span>
                    )}
                  </div>
                )}

                {/* Time + read */}
                <div
                  className="flex items-center gap-1 mt-0.5 mx-1"
                  style={{ color: "hsl(220, 15%, 58%)", fontSize: "10px" }}
                >
                  {msg.time}
                  {msg.outgoing && (
                    <Icon
                      name={msg.read ? "CheckCheck" : "Check"}
                      size={11}
                      style={{ color: msg.read ? "hsl(210, 85%, 55%)" : "hsl(220, 15%, 58%)" } as React.CSSProperties}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {typing && (
          <div className="flex justify-start mt-2 animate-fade-in">
            <div
              className="px-4 py-3 rounded-2xl flex items-center gap-1"
              style={{ background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }}
            >
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "hsl(210, 20%, 65%)",
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-2 flex-shrink-0">
        <div
          className="flex items-end gap-2 rounded-3xl px-4 py-2"
          style={{ background: "#fff", boxShadow: "0 1px 8px rgba(0,0,0,0.1)" }}
        >
          <button className="mb-1.5 flex-shrink-0" style={{ color: "hsl(210, 85%, 55%)" }}>
            <Icon name="Paperclip" size={20} />
          </button>
          <textarea
            value={input}
            onChange={handleInput}
            onKeyDown={handleKey}
            placeholder="Сообщение..."
            rows={1}
            className="flex-1 resize-none outline-none text-sm leading-relaxed bg-transparent py-1.5"
            style={{ color: "hsl(220, 30%, 10%)", maxHeight: "100px" }}
          />
          {input.trim() ? (
            <button
              onClick={send}
              className="mb-1 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 active:scale-95"
              style={{ background: "hsl(210, 85%, 55%)", color: "#fff" }}
            >
              <Icon name="Send" size={16} />
            </button>
          ) : (
            <button className="mb-1.5 flex-shrink-0" style={{ color: "hsl(210, 85%, 55%)" }}>
              <Icon name="Mic" size={20} />
            </button>
          )}
        </div>
        <p className="text-center text-[10px] mt-1.5" style={{ color: "hsl(220, 15%, 70%)" }}>
          Дважды нажмите на сообщение чтобы поставить реакцию
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
