import Icon from "@/components/ui/icon";
import { Section, Contact } from "@/pages/Index";

interface Props {
  section: Section;
  onSection: (s: Section) => void;
  me: Contact;
  unreadTotal: number;
}

const NAV = [
  { id: "chats" as Section, icon: "MessageSquare", label: "Чаты" },
  { id: "contacts" as Section, icon: "Users", label: "Контакты" },
  { id: "profile" as Section, icon: "User", label: "Профиль" },
  { id: "settings" as Section, icon: "Settings", label: "Настройки" },
];

export default function Sidebar({ section, onSection, unreadTotal }: Props) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 border-t"
      style={{
        background: "#fff",
        borderColor: "hsl(220, 20%, 90%)",
        height: "60px",
        boxShadow: "0 -1px 12px rgba(0,0,0,0.08)",
      }}
    >
      {NAV.map(item => {
        const isActive = section === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSection(item.id)}
            className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-150"
            style={{ color: isActive ? "hsl(210, 85%, 50%)" : "hsl(220, 15%, 55%)" }}
          >
            <div className="relative">
              <Icon name={item.icon} size={22} />
              {item.id === "chats" && unreadTotal > 0 && (
                <span
                  className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                  style={{ background: "hsl(0, 72%, 51%)" }}
                >
                  {unreadTotal > 9 ? "9+" : unreadTotal}
                </span>
              )}
            </div>
            <span
              className="text-[10px] font-medium leading-none"
              style={{ color: isActive ? "hsl(210, 85%, 50%)" : "hsl(220, 15%, 55%)" }}
            >
              {item.label}
            </span>
            {isActive && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full"
                style={{ width: "24px", height: "3px", background: "hsl(210, 85%, 50%)" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
