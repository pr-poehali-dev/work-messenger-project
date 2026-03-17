import { useState } from "react";
import { Contact, CallType } from "@/pages/Index";
import Icon from "@/components/ui/icon";
import StatusDot from "./StatusDot";

interface Props {
  contacts: Contact[];
  onChat: (contact: Contact) => void;
  onCall: (type: CallType, contact: Contact) => void;
}

const STATUS_LABEL = { online: "В сети", away: "Не активен", offline: "Не в сети" };
const DEPARTMENTS = ["Все", "Стратегия", "Финансы", "PMO", "Юриспруденция", "Технологии", "Персонал", "Аналитика", "Маркетинг"];

const AVATAR_COLORS = [
  "hsl(222, 60%, 35%)",
  "hsl(200, 60%, 35%)",
  "hsl(260, 50%, 40%)",
  "hsl(180, 50%, 32%)",
  "hsl(240, 55%, 38%)",
  "hsl(210, 65%, 32%)",
  "hsl(190, 55%, 30%)",
  "hsl(230, 50%, 38%)",
];

export default function Contacts({ contacts, onChat, onCall }: Props) {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("Все");

  const filtered = contacts.filter(c => {
    const matchName = c.name.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === "Все" || c.department === dept;
    return matchName && matchDept;
  });

  const online = filtered.filter(c => c.status === "online");
  const other = filtered.filter(c => c.status !== "online");

  return (
    <div className="flex-1 flex flex-col" style={{ background: "hsl(220, 25%, 97%)" }}>
      {/* Header */}
      <div
        className="px-8 pt-8 pb-5 border-b"
        style={{ background: "#fff", borderColor: "hsl(220, 20%, 90%)" }}
      >
        <h1 className="text-xl font-semibold mb-4" style={{ color: "hsl(220, 30%, 10%)" }}>
          Контакты
        </h1>
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Icon
              name="Search"
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "hsl(220, 15%, 55%)" } as React.CSSProperties}
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по имени..."
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
              style={{
                background: "hsl(220, 20%, 95%)",
                border: "1px solid hsl(220, 20%, 88%)",
                color: "hsl(220, 30%, 10%)",
              }}
            />
          </div>
        </div>
        {/* Dept filter */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {DEPARTMENTS.map(d => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-150"
              style={
                dept === d
                  ? { background: "hsl(222, 60%, 28%)", color: "#fff" }
                  : { background: "hsl(220, 20%, 92%)", color: "hsl(220, 30%, 40%)" }
              }
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {online.length > 0 && (
          <section className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "hsl(220, 15%, 55%)" }}>
              В сети · {online.length}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {online.map(c => <ContactCard key={c.id} contact={c} onChat={onChat} onCall={onCall} />)}
            </div>
          </section>
        )}
        {other.length > 0 && (
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "hsl(220, 15%, 55%)" }}>
              Не в сети · {other.length}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {other.map(c => <ContactCard key={c.id} contact={c} onChat={onChat} onCall={onCall} />)}
            </div>
          </section>
        )}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Icon name="Users" size={40} className="mx-auto mb-3" style={{ color: "hsl(220, 15%, 70%)" } as React.CSSProperties} />
            <p className="text-sm" style={{ color: "hsl(220, 15%, 55%)" }}>Контакты не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ContactCard({ contact, onChat, onCall }: { contact: Contact; onChat: (c: Contact) => void; onCall: (t: CallType, c: Contact) => void }) {
  const color = ["hsl(222,60%,35%)", "hsl(200,60%,35%)", "hsl(260,50%,40%)", "hsl(180,50%,32%)", "hsl(240,55%,38%)", "hsl(210,65%,32%)", "hsl(190,55%,30%)", "hsl(230,50%,38%)"][contact.id % 8];
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 transition-all duration-150 hover:shadow-md group animate-fade-in"
      style={{ background: "#fff", border: "1px solid hsl(220, 20%, 91%)" }}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold text-white"
            style={{ background: color }}
          >
            {contact.initials}
          </div>
          <StatusDot status={contact.status} size="sm" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: "hsl(220, 30%, 10%)" }}>
            {contact.name}
          </p>
          <p className="text-xs truncate" style={{ color: "hsl(220, 15%, 55%)" }}>
            {STATUS_LABEL[contact.status]}
          </p>
        </div>
      </div>
      <div>
        <p className="text-xs truncate" style={{ color: "hsl(220, 20%, 40%)" }}>{contact.role}</p>
        <span
          className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium"
          style={{ background: "hsl(222, 50%, 95%)", color: "hsl(222, 60%, 35%)" }}
        >
          {contact.department}
        </span>
      </div>
      <div className="flex gap-2 pt-1 border-t" style={{ borderColor: "hsl(220, 20%, 92%)" }}>
        <button
          onClick={() => onChat(contact)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
          style={{ background: "hsl(222, 60%, 28%)", color: "#fff" }}
        >
          <Icon name="MessageSquare" size={13} />
          Чат
        </button>
        <button
          onClick={() => onCall("audio", contact)}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
          style={{ background: "hsl(220, 20%, 93%)", color: "hsl(220, 30%, 35%)" }}
          title="Аудиозвонок"
        >
          <Icon name="Phone" size={13} />
        </button>
        <button
          onClick={() => onCall("video", contact)}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
          style={{ background: "hsl(220, 20%, 93%)", color: "hsl(220, 30%, 35%)" }}
          title="Видеозвонок"
        >
          <Icon name="Video" size={13} />
        </button>
      </div>
    </div>
  );
}
