import { useState, useRef, useEffect } from "react";
import { Chat, Contact, CallType } from "@/pages/Index";
import Icon from "@/components/ui/icon";
import StatusDot from "./StatusDot";

interface Props {
  chat: Chat | null;
  me: Contact;
  onSend: (text: string) => void;
  onCall: (type: CallType, contact: Contact) => void;
}

const STATUS_LABEL = { online: "В сети", away: "Не активен", offline: "Не в сети" };

export default function ChatWindow({ chat, me, onSend, onCall }: Props) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  const send = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "hsl(220, 25%, 97%)" }}>
        <div className="text-center animate-fade-in">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "hsl(222, 60%, 28%)" }}
          >
            <Icon name="MessageSquare" size={28} className="text-white" />
          </div>
          <p className="font-semibold text-lg" style={{ color: "hsl(220, 30%, 20%)" }}>
            Выберите чат
          </p>
          <p className="text-sm mt-1" style={{ color: "hsl(220, 15%, 55%)" }}>
            Начните общение с коллегами
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col" style={{ background: "hsl(220, 25%, 97%)" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-3.5 border-b"
        style={{ background: "#fff", borderColor: "hsl(220, 20%, 90%)" }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white"
              style={{ background: getAvatarColor(chat.contact.id) }}
            >
              {chat.contact.initials}
            </div>
            <StatusDot status={chat.contact.status} size="sm" />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: "hsl(220, 30%, 10%)" }}>
              {chat.contact.name}
            </p>
            <p className="text-xs" style={{ color: "hsl(220, 15%, 55%)" }}>
              {STATUS_LABEL[chat.contact.status]} · {chat.contact.role}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onCall("audio", chat.contact)}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 hover:bg-gray-100"
            title="Аудиозвонок"
            style={{ color: "hsl(220, 30%, 40%)" }}
          >
            <Icon name="Phone" size={17} />
          </button>
          <button
            onClick={() => onCall("video", chat.contact)}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 hover:bg-gray-100"
            title="Видеозвонок"
            style={{ color: "hsl(220, 30%, 40%)" }}
          >
            <Icon name="Video" size={17} />
          </button>
          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 hover:bg-gray-100"
            title="Информация"
            style={{ color: "hsl(220, 30%, 40%)" }}
          >
            <Icon name="Info" size={17} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-2">
        {chat.messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm" style={{ color: "hsl(220, 15%, 60%)" }}>
              Начните переписку с {chat.contact.name.split(" ")[0]}
            </p>
          </div>
        )}
        {chat.messages.map((msg, i) => {
          const isFirst = i === 0 || chat.messages[i - 1].outgoing !== msg.outgoing;
          return (
            <div
              key={msg.id}
              className={`flex ${msg.outgoing ? "justify-end" : "justify-start"} animate-fade-in`}
              style={{ marginTop: isFirst ? "8px" : "2px" }}
            >
              {!msg.outgoing && isFirst && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white mr-2 mt-auto mb-1 flex-shrink-0"
                  style={{ background: getAvatarColor(chat.contact.id) }}
                >
                  {chat.contact.initials}
                </div>
              )}
              {!msg.outgoing && !isFirst && <div className="w-7 mr-2" />}

              <div className="max-w-[60%]">
                <div
                  className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.outgoing
                      ? {
                          background: "hsl(222, 60%, 28%)",
                          color: "#fff",
                          borderBottomRightRadius: "6px",
                        }
                      : {
                          background: "#fff",
                          color: "hsl(220, 30%, 12%)",
                          border: "1px solid hsl(220, 20%, 90%)",
                          borderBottomLeftRadius: "6px",
                        }
                  }
                >
                  {msg.text}
                </div>
                <div
                  className={`flex items-center gap-1 mt-1 text-[10px] ${msg.outgoing ? "justify-end" : "justify-start"}`}
                  style={{ color: "hsl(220, 15%, 55%)" }}
                >
                  {msg.time}
                  {msg.outgoing && (
                    <Icon
                      name={msg.read ? "CheckCheck" : "Check"}
                      size={11}
                      style={{ color: msg.read ? "hsl(210, 85%, 55%)" : "hsl(220, 15%, 55%)" } as React.CSSProperties}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 pb-5 pt-3">
        <div
          className="flex items-end gap-3 rounded-2xl px-4 py-3"
          style={{ background: "#fff", border: "1px solid hsl(220, 20%, 88%)" }}
        >
          <button
            className="flex-shrink-0 mb-0.5"
            style={{ color: "hsl(220, 15%, 60%)" }}
            title="Прикрепить файл"
          >
            <Icon name="Paperclip" size={17} />
          </button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Написать сообщение..."
            rows={1}
            className="flex-1 resize-none outline-none text-sm leading-relaxed bg-transparent"
            style={{ color: "hsl(220, 30%, 12%)", maxHeight: "120px" }}
          />
          <div className="flex items-center gap-2 flex-shrink-0 mb-0.5">
            <button style={{ color: "hsl(220, 15%, 60%)" }} title="Эмодзи">
              <Icon name="Smile" size={17} />
            </button>
            <button
              onClick={send}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150"
              style={{
                background: input.trim() ? "hsl(210, 85%, 55%)" : "hsl(220, 20%, 88%)",
                color: input.trim() ? "#fff" : "hsl(220, 15%, 55%)",
              }}
            >
              <Icon name="Send" size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getAvatarColor(id: number): string {
  const colors = [
    "hsl(222, 60%, 35%)",
    "hsl(200, 60%, 35%)",
    "hsl(260, 50%, 40%)",
    "hsl(180, 50%, 32%)",
    "hsl(240, 55%, 38%)",
    "hsl(210, 65%, 32%)",
    "hsl(190, 55%, 30%)",
    "hsl(230, 50%, 38%)",
  ];
  return colors[id % colors.length];
}
