import { useState } from "react";
import { Contact } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface Props {
  me: Contact;
}

const STATUS_OPTIONS = [
  { value: "online", label: "В сети", color: "hsl(142, 70%, 45%)" },
  { value: "away", label: "Не активен", color: "hsl(38, 92%, 50%)" },
  { value: "offline", label: "Невидимый", color: "hsl(220, 15%, 45%)" },
];

export default function Profile({ me }: Props) {
  const [status, setStatus] = useState(me.status);
  const [bio, setBio] = useState("Руководитель компании. Открыт для стратегических переговоров.");
  const [phone, setPhone] = useState("+7 (495) 123-45-67");
  const [editing, setEditing] = useState(false);

  const currentStatus = STATUS_OPTIONS.find(s => s.value === status)!;

  return (
    <div className="flex-1 flex flex-col" style={{ background: "hsl(220, 25%, 97%)" }}>
      <div
        className="px-8 pt-8 pb-6 border-b"
        style={{ background: "#fff", borderColor: "hsl(220, 20%, 90%)" }}
      >
        <h1 className="text-xl font-semibold" style={{ color: "hsl(220, 30%, 10%)" }}>Мой профиль</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-lg mx-auto">
          {/* Avatar block */}
          <div
            className="rounded-2xl p-6 flex items-center gap-5 mb-6"
            style={{ background: "#fff", border: "1px solid hsl(220, 20%, 91%)" }}
          >
            <div className="relative">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                style={{ background: "hsl(222, 60%, 28%)" }}
              >
                {me.initials}
              </div>
              <button
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: "hsl(210, 85%, 55%)", color: "#fff" }}
                title="Изменить фото"
              >
                <Icon name="Camera" size={13} />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg" style={{ color: "hsl(220, 30%, 10%)" }}>{me.name}</h2>
              <p className="text-sm mt-0.5" style={{ color: "hsl(220, 15%, 50%)" }}>{me.role}</p>
              <span
                className="inline-block mt-2 px-2.5 py-0.5 rounded text-xs font-medium"
                style={{ background: "hsl(222, 50%, 94%)", color: "hsl(222, 60%, 30%)" }}
              >
                {me.department}
              </span>
            </div>
          </div>

          {/* Status */}
          <div
            className="rounded-2xl p-5 mb-5"
            style={{ background: "#fff", border: "1px solid hsl(220, 20%, 91%)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "hsl(220, 15%, 55%)" }}>
              Статус
            </p>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value as typeof status)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all duration-150"
                  style={
                    status === s.value
                      ? { background: "hsl(222, 60%, 28%)", color: "#fff" }
                      : { background: "hsl(220, 20%, 94%)", color: "hsl(220, 30%, 40%)" }
                  }
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div
            className="rounded-2xl p-5 mb-5"
            style={{ background: "#fff", border: "1px solid hsl(220, 20%, 91%)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "hsl(220, 15%, 55%)" }}>
                Информация
              </p>
              <button
                onClick={() => setEditing(!editing)}
                className="text-xs font-medium px-3 py-1 rounded-lg transition-all"
                style={editing
                  ? { background: "hsl(210, 85%, 55%)", color: "#fff" }
                  : { background: "hsl(220, 20%, 93%)", color: "hsl(220, 30%, 40%)" }
                }
              >
                {editing ? "Сохранить" : "Изменить"}
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[11px] text-gray-400 mb-1 font-medium">О себе</p>
                {editing ? (
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={2}
                    className="w-full text-sm rounded-lg px-3 py-2 outline-none resize-none"
                    style={{
                      background: "hsl(220, 20%, 95%)",
                      border: "1px solid hsl(220, 20%, 88%)",
                      color: "hsl(220, 30%, 10%)",
                    }}
                  />
                ) : (
                  <p className="text-sm" style={{ color: "hsl(220, 30%, 20%)" }}>{bio}</p>
                )}
              </div>

              <InfoRow icon="Phone" label="Телефон" value={phone} editing={editing} onChange={setPhone} />
              <InfoRow icon="Mail" label="Email" value="v.orlov@company.ru" editing={false} onChange={() => {}} />
              <InfoRow icon="Building2" label="Отдел" value={me.department} editing={false} onChange={() => {}} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Сообщений", value: "1 284" },
              { label: "Контактов", value: "8" },
              { label: "Дней активности", value: "247" },
            ].map(stat => (
              <div
                key={stat.label}
                className="rounded-xl p-4 text-center"
                style={{ background: "#fff", border: "1px solid hsl(220, 20%, 91%)" }}
              >
                <p className="text-xl font-bold" style={{ color: "hsl(222, 60%, 28%)" }}>{stat.value}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "hsl(220, 15%, 55%)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, editing, onChange }: {
  icon: string; label: string; value: string; editing: boolean; onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "hsl(222, 50%, 94%)" }}>
        <Icon name={icon} size={14} style={{ color: "hsl(222, 60%, 35%)" } as React.CSSProperties} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium" style={{ color: "hsl(220, 15%, 55%)" }}>{label}</p>
        {editing ? (
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full text-sm outline-none rounded px-1"
            style={{ background: "hsl(220, 20%, 95%)", color: "hsl(220, 30%, 10%)" }}
          />
        ) : (
          <p className="text-sm truncate" style={{ color: "hsl(220, 30%, 15%)" }}>{value}</p>
        )}
      </div>
    </div>
  );
}
