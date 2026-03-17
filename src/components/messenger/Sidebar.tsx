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

export default function Sidebar({ section, onSection, me, unreadTotal }: Props) {
  return (
    <div
      className="flex flex-col items-center py-5 gap-1 w-16 flex-shrink-0 border-r"
      style={{
        background: "hsl(222, 50%, 10%)",
        borderColor: "hsl(222, 40%, 18%)",
      }}
    >
      <div className="mb-4 mt-1">
        <div
          className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-white"
          style={{ background: "hsl(210, 85%, 55%)" }}
        >
          CP
        </div>
      </div>

      <div className="flex flex-col gap-1 flex-1 w-full px-2">
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => onSection(item.id)}
            title={item.label}
            className="relative flex flex-col items-center justify-center w-full h-11 rounded-lg transition-all duration-150 group"
            style={{
              background: section === item.id ? "hsl(210, 85%, 55%)" : "transparent",
              color: section === item.id ? "#fff" : "hsl(210, 20%, 60%)",
            }}
          >
            <Icon name={item.icon} size={18} />
            {item.id === "chats" && unreadTotal > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                style={{ background: "hsl(0, 72%, 51%)" }}
              >
                {unreadTotal > 9 ? "9+" : unreadTotal}
              </span>
            )}
            <span className="text-[9px] mt-0.5 font-medium leading-none">{item.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => onSection("profile")}
        className="mt-2 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white relative"
        style={{ background: "hsl(222, 60%, 30%)", border: "2px solid hsl(222, 40%, 22%)" }}
        title={me.name}
      >
        {me.initials}
        <span
          className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
          style={{
            background: "hsl(142, 70%, 45%)",
            borderColor: "hsl(222, 50%, 10%)",
          }}
        />
      </button>
    </div>
  );
}
