import { useState } from "react";
import { Chat } from "@/pages/Index";
import Icon from "@/components/ui/icon";
import StatusDot from "./StatusDot";

interface Props {
  chats: Chat[];
  activeChat: Chat | null;
  onSelect: (chat: Chat) => void;
}

export default function ChatList({ chats, activeChat, onSelect }: Props) {
  const [search, setSearch] = useState("");

  const filtered = chats.filter(c =>
    c.contact.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="flex flex-col w-72 flex-shrink-0 border-r"
      style={{ background: "hsl(222, 45%, 13%)", borderColor: "hsl(222, 40%, 18%)" }}
    >
      <div className="px-4 pt-5 pb-3">
        <h2 className="text-white font-semibold text-base mb-3 tracking-wide">Сообщения</h2>
        <div className="relative">
          <Icon
            name="Search"
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "hsl(210, 20%, 55%)" } as React.CSSProperties}
          />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск чатов..."
            className="w-full pl-8 pr-3 py-2 rounded-lg text-sm outline-none text-white placeholder:text-[hsl(210,20%,45%)]"
            style={{
              background: "hsl(222, 45%, 18%)",
              border: "1px solid hsl(222, 40%, 22%)",
            }}
          />
        </div>
      </div>

      <div className="px-3 pb-2">
        <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "hsl(210,20%,45%)" }}>
          Все диалоги
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {filtered.length === 0 && (
          <div className="text-center py-8 text-sm" style={{ color: "hsl(210,20%,45%)" }}>
            Ничего не найдено
          </div>
        )}
        {filtered.map(chat => {
          const isActive = activeChat?.id === chat.id;
          return (
            <button
              key={chat.id}
              onClick={() => onSelect(chat)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-all duration-150"
              style={{
                background: isActive ? "hsl(210, 85%, 55%, 0.15)" : "transparent",
                borderLeft: isActive ? "2px solid hsl(210, 85%, 55%)" : "2px solid transparent",
              }}
            >
              <div className="relative flex-shrink-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                  style={{ background: getAvatarColor(chat.contact.id) }}
                >
                  {chat.contact.initials}
                </div>
                <StatusDot status={chat.contact.status} size="sm" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-medium truncate"
                    style={{ color: isActive ? "#fff" : "hsl(210, 25%, 88%)" }}
                  >
                    {chat.contact.name}
                  </span>
                  <span className="text-[10px] ml-1 flex-shrink-0" style={{ color: "hsl(210,20%,45%)" }}>
                    {chat.lastTime}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs truncate" style={{ color: "hsl(210,20%,50%)" }}>
                    {chat.lastMessage || "Начните диалог"}
                  </span>
                  {chat.unread > 0 && (
                    <span
                      className="ml-1 flex-shrink-0 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                      style={{ background: "hsl(210, 85%, 55%)" }}
                    >
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-3 pb-3 pt-1 border-t" style={{ borderColor: "hsl(222, 40%, 18%)" }}>
        <button
          className="w-full flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-150"
          style={{ color: "hsl(210, 85%, 65%)", background: "hsl(210, 85%, 55%, 0.1)" }}
        >
          <Icon name="Plus" size={15} />
          Новый чат
        </button>
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
