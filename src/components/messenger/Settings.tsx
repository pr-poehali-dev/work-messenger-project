import { useState } from "react";
import { Contact } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface Props {
  me: Contact;
}

export default function Settings({ me }: Props) {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [desktop, setDesktop] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);
  const [theme, setTheme] = useState<"light" | "system">("light");

  return (
    <div className="flex-1 flex flex-col" style={{ background: "hsl(220, 25%, 97%)" }}>
      <div
        className="px-8 pt-8 pb-6 border-b"
        style={{ background: "#fff", borderColor: "hsl(220, 20%, 90%)" }}
      >
        <h1 className="text-xl font-semibold" style={{ color: "hsl(220, 30%, 10%)" }}>Настройки</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-lg mx-auto flex flex-col gap-5">

          {/* Account */}
          <Section title="Аккаунт">
            <div className="flex items-center gap-4 py-1">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ background: "hsl(222, 60%, 28%)" }}
              >
                {me.initials}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: "hsl(220, 30%, 10%)" }}>{me.name}</p>
                <p className="text-xs" style={{ color: "hsl(220, 15%, 55%)" }}>{me.role}</p>
              </div>
              <button
                className="text-xs px-3 py-1.5 rounded-lg font-medium"
                style={{ background: "hsl(220, 20%, 93%)", color: "hsl(220, 30%, 35%)" }}
              >
                Изменить
              </button>
            </div>
          </Section>

          {/* Notifications */}
          <Section title="Уведомления">
            <Toggle label="Push-уведомления" description="Уведомления о новых сообщениях" value={notifications} onChange={setNotifications} />
            <Toggle label="Звуки" description="Звуковые сигналы при получении сообщений" value={sounds} onChange={setSounds} />
            <Toggle label="Рабочий стол" description="Показывать уведомления на рабочем столе" value={desktop} onChange={setDesktop} />
          </Section>

          {/* Privacy */}
          <Section title="Конфиденциальность">
            <Toggle label="Подтверждение прочтения" description="Показывать, что вы прочли сообщение" value={readReceipts} onChange={setReadReceipts} />
            <div className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: "hsl(220, 20%, 93%)" }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "hsl(220, 30%, 12%)" }}>Видимость профиля</p>
                <p className="text-xs mt-0.5" style={{ color: "hsl(220, 15%, 55%)" }}>Кто может видеть ваш профиль</p>
              </div>
              <select
                className="text-xs px-2 py-1.5 rounded-lg outline-none font-medium"
                style={{ background: "hsl(220, 20%, 93%)", color: "hsl(220, 30%, 25%)", border: "none" }}
                defaultValue="company"
              >
                <option value="company">Компания</option>
                <option value="all">Все</option>
                <option value="nobody">Только я</option>
              </select>
            </div>
          </Section>

          {/* Security */}
          <Section title="Безопасность">
            <SettingsRow icon="Lock" label="Изменить пароль" description="Последнее изменение: 3 мес. назад" />
            <SettingsRow icon="ShieldCheck" label="Двухфакторная аутентификация" description="Не активировано" badge="Рекомендуется" />
            <SettingsRow icon="Smartphone" label="Активные сессии" description="2 устройства" />
          </Section>

          {/* Appearance */}
          <Section title="Оформление">
            <div className="flex gap-3 py-2">
              {([
                { id: "light", label: "Светлая", icon: "Sun" },
                { id: "system", label: "Системная", icon: "Monitor" },
              ] as const).map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className="flex-1 py-3 rounded-xl flex flex-col items-center gap-2 text-xs font-medium transition-all"
                  style={
                    theme === t.id
                      ? { background: "hsl(222, 60%, 28%)", color: "#fff" }
                      : { background: "hsl(220, 20%, 93%)", color: "hsl(220, 30%, 40%)" }
                  }
                >
                  <Icon name={t.icon} size={18} />
                  {t.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Danger */}
          <Section title="Прочее">
            <SettingsRow icon="Download" label="Экспорт данных" description="Скачать историю сообщений" />
            <SettingsRow icon="LogOut" label="Выйти из аккаунта" description="" danger />
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid hsl(220, 20%, 91%)" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "hsl(220, 20%, 93%)", background: "hsl(220, 20%, 98%)" }}>
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "hsl(220, 15%, 55%)" }}>{title}</p>
      </div>
      <div className="px-5 divide-y" style={{ divideColor: "hsl(220, 20%, 93%)" }}>
        {children}
      </div>
    </div>
  );
}

function Toggle({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: "hsl(220, 20%, 93%)" }}>
      <div>
        <p className="text-sm font-medium" style={{ color: "hsl(220, 30%, 12%)" }}>{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: "hsl(220, 15%, 55%)" }}>{description}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className="relative w-10 h-5.5 rounded-full transition-all duration-200 flex-shrink-0"
        style={{
          background: value ? "hsl(210, 85%, 55%)" : "hsl(220, 20%, 80%)",
          width: "40px",
          height: "22px",
        }}
      >
        <span
          className="absolute top-0.5 rounded-full bg-white transition-all duration-200"
          style={{
            width: "18px",
            height: "18px",
            left: value ? "20px" : "2px",
          }}
        />
      </button>
    </div>
  );
}

function SettingsRow({ icon, label, description, badge, danger }: {
  icon: string; label: string; description: string; badge?: string; danger?: boolean;
}) {
  return (
    <button className="w-full flex items-center gap-3 py-3 border-b last:border-0 text-left group transition-all" style={{ borderColor: "hsl(220, 20%, 93%)" }}>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: danger ? "hsl(0, 72%, 96%)" : "hsl(222, 50%, 94%)" }}
      >
        <Icon
          name={icon}
          size={15}
          style={{ color: danger ? "hsl(0, 72%, 51%)" : "hsl(222, 60%, 35%)" } as React.CSSProperties}
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium" style={{ color: danger ? "hsl(0, 72%, 45%)" : "hsl(220, 30%, 12%)" }}>{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: "hsl(220, 15%, 55%)" }}>{description}</p>}
      </div>
      {badge && (
        <span className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ background: "hsl(38, 92%, 92%)", color: "hsl(38, 80%, 35%)" }}>
          {badge}
        </span>
      )}
      <Icon name="ChevronRight" size={15} style={{ color: "hsl(220, 15%, 65%)" } as React.CSSProperties} />
    </button>
  );
}
