import { useState } from "react";
import { Chat } from "@/pages/Index";
import Icon from "@/components/ui/icon";
import StatusDot from "./StatusDot";

interface Props {
  chats: Chat[];
  onSelect: (chat: Chat) => void;
}

const AVATAR_COLORS = [
  "hsl(222, 60%, 35%)", "hsl(200, 60%, 35%)", "hsl(260, 50%, 40%)",
  "hsl(180, 50%, 32%)", "hsl(240, 55%, 38%)", "hsl(210, 65%, 32%)",
  "hsl(190, 55%, 30%)", "hsl(230, 50%, 38%)",
];

export default function ChatList({ chats, onSelect }: Props) {
  const [search, setSearch] = useState("");

  const filtered = chats.filter(c =>
    c.contact.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = chats.reduce((a, c) => a + c.unread, 0);

  return (
    <div className="flex flex-col w-full h-full" style={{ background: "#fff" }}>
      {/* Header */}
      <div
        className="px-4 pt-5 pb-3 border-b"
        style={{ borderColor: "hsl(220, 20%, 92%)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold" style={{ color: "hsl(220, 30%, 8%)" }}>
            Сообщения
          </h1>
          {totalUnread > 0 && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ background: "hsl(210, 85%, 55%)" }}
            >
              {totalUnread} новых
            </span>
          )}
        </div>
        <div className="relative">
          <Icon
            name="Search"
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "hsl(220, 15%, 60%)" } as React.CSSProperties}
          />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: "hsl(220, 20%, 95%)",
              color: "hsl(220, 30%, 10%)",
            }}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Icon name="Search" size={36} style={{ color: "hsl(220, 15%, 75%)" } as React.CSSProperties} />
            <p className="text-sm" style={{ color: "hsl(220, 15%, 55%)" }}>Ничего не найдено</p>
          </div>
        )}
        {filtered.map((chat, idx) => {
          const color = AVATAR_COLORS[chat.contact.id % AVATAR_COLORS.length];
          const hasUnread = chat.unread > 0;
          return (
            <button
              key={chat.id}
              onClick={() => onSelect(chat)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-100 active:scale-[0.99]"
              style={{
                borderBottom: idx < filtered.length - 1 ? "1px solid hsl(220, 20%, 96%)" : "none",
                background: "transparent",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "hsl(220, 20%, 97%)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: color }}
                >
                  {chat.contact.initials}
                </div>
                <StatusDot status={chat.contact.status} size="sm" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className="text-sm font-semibold truncate"
                    style={{ color: "hsl(220, 30%, 8%)", fontWeight: hasUnread ? 700 : 600 }}
                  >
                    {chat.contact.name}
                  </span>
                  <span
                    className="text-[11px] flex-shrink-0"
                    style={{ color: hasUnread ? "hsl(210, 85%, 50%)" : "hsl(220, 15%, 55%)" }}
                  >
                    {chat.lastTime}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5 gap-2">
                  <span
                    className="text-[13px] truncate"
                    style={{
                      color: hasUnread ? "hsl(220, 30%, 12%)" : "hsl(220, 15%, 52%)",
                      fontWeight: hasUnread ? 500 : 400,
                    }}
                  >
                    {chat.lastMessage || "Начните диалог"}
                  </span>
                  {hasUnread && (
                    <span
                      className="flex-shrink-0 min-w-[20px] h-5 rounded-full text-[11px] font-bold flex items-center justify-center text-white px-1"
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

      {/* FAB — новый чат */}
      <button
        className="absolute right-4 bottom-20 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-150 active:scale-95 hover:scale-105"
        style={{ background: "hsl(210, 85%, 55%)", color: "#fff" }}
        title="Новый чат"
      >
        <Icon name="MessageSquarePlus" size={24} />
      </button>
    </div>
  );
}
