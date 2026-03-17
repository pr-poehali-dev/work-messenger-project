import { useState } from "react";
import Sidebar from "@/components/messenger/Sidebar";
import ChatList from "@/components/messenger/ChatList";
import ChatWindow from "@/components/messenger/ChatWindow";
import Contacts from "@/components/messenger/Contacts";
import Profile from "@/components/messenger/Profile";
import Settings from "@/components/messenger/Settings";
import CallModal from "@/components/messenger/CallModal";

export type Section = "chats" | "contacts" | "profile" | "settings";
export type CallType = "audio" | "video" | null;

export interface Contact {
  id: number;
  name: string;
  role: string;
  department: string;
  status: "online" | "away" | "offline";
  avatar: string;
  initials: string;
}

export interface Message {
  id: number;
  text: string;
  time: string;
  outgoing: boolean;
  read: boolean;
}

export interface Chat {
  id: number;
  contact: Contact;
  messages: Message[];
  lastMessage: string;
  lastTime: string;
  unread: number;
}

const CONTACTS: Contact[] = [
  { id: 1, name: "Александр Воронов", role: "Директор по развитию", department: "Стратегия", status: "online", avatar: "", initials: "АВ" },
  { id: 2, name: "Елена Соколова", role: "Финансовый директор", department: "Финансы", status: "online", avatar: "", initials: "ЕС" },
  { id: 3, name: "Михаил Петров", role: "Руководитель проектов", department: "PMO", status: "away", avatar: "", initials: "МП" },
  { id: 4, name: "Ирина Захарова", role: "Юридический советник", department: "Юриспруденция", status: "online", avatar: "", initials: "ИЗ" },
  { id: 5, name: "Дмитрий Козлов", role: "CTO", department: "Технологии", status: "offline", avatar: "", initials: "ДК" },
  { id: 6, name: "Наталья Романова", role: "HR-директор", department: "Персонал", status: "away", avatar: "", initials: "НР" },
  { id: 7, name: "Сергей Морозов", role: "Старший аналитик", department: "Аналитика", status: "online", avatar: "", initials: "СМ" },
  { id: 8, name: "Анна Белова", role: "Маркетинг-директор", department: "Маркетинг", status: "offline", avatar: "", initials: "АБ" },
];

const INITIAL_CHATS: Chat[] = [
  {
    id: 1,
    contact: CONTACTS[0],
    messages: [
      { id: 1, text: "Добрый день, Александр. Подготовил отчёт по Q4.", time: "09:15", outgoing: true, read: true },
      { id: 2, text: "Отлично, отправьте на согласование в финансовый отдел.", time: "09:22", outgoing: false, read: true },
      { id: 3, text: "Уже отправил. Ожидаем подтверждения до конца дня.", time: "09:25", outgoing: true, read: true },
      { id: 4, text: "Хорошо. Встреча в 14:00 остаётся в силе?", time: "09:30", outgoing: false, read: true },
      { id: 5, text: "Да, подтверждаю участие.", time: "09:31", outgoing: true, read: false },
    ],
    lastMessage: "Да, подтверждаю участие.",
    lastTime: "09:31",
    unread: 0,
  },
  {
    id: 2,
    contact: CONTACTS[1],
    messages: [
      { id: 1, text: "Елена, можете поделиться бюджетом на следующий квартал?", time: "Вчера", outgoing: true, read: true },
      { id: 2, text: "Конечно, пришлю сегодня после обеда.", time: "Вчера", outgoing: false, read: true },
      { id: 3, text: "Бюджет согласован советом директоров.", time: "10:05", outgoing: false, read: false },
    ],
    lastMessage: "Бюджет согласован советом директоров.",
    lastTime: "10:05",
    unread: 1,
  },
  {
    id: 3,
    contact: CONTACTS[2],
    messages: [
      { id: 1, text: "Михаил, как статус по проекту Альфа?", time: "Пн", outgoing: true, read: true },
      { id: 2, text: "Идём по плану. Завершение — конец месяца.", time: "Пн", outgoing: false, read: true },
    ],
    lastMessage: "Идём по плану. Завершение — конец месяца.",
    lastTime: "Пн",
    unread: 0,
  },
  {
    id: 4,
    contact: CONTACTS[3],
    messages: [
      { id: 1, text: "Ирина, требуется юридическое заключение по договору №5521.", time: "Вт", outgoing: true, read: true },
      { id: 2, text: "Приму в работу. Срок — 3 рабочих дня.", time: "Вт", outgoing: false, read: true },
      { id: 3, text: "Заключение готово, направила на почту.", time: "Ср", outgoing: false, read: false },
      { id: 4, text: "Спасибо, получила.", time: "Ср", outgoing: false, read: false },
    ],
    lastMessage: "Спасибо, получила.",
    lastTime: "Ср",
    unread: 2,
  },
  {
    id: 5,
    contact: CONTACTS[6],
    messages: [
      { id: 1, text: "Сергей, подготовьте сравнительный анализ рынка.", time: "Пт", outgoing: true, read: true },
      { id: 2, text: "Принято. Каковы приоритетные сегменты?", time: "Пт", outgoing: false, read: true },
    ],
    lastMessage: "Принято. Каковы приоритетные сегменты?",
    lastTime: "Пт",
    unread: 0,
  },
];

export const ME: Contact = {
  id: 0,
  name: "Виктор Орлов",
  role: "Генеральный директор",
  department: "Руководство",
  status: "online",
  avatar: "",
  initials: "ВО",
};

export default function Index() {
  const [section, setSection] = useState<Section>("chats");
  const [activeChat, setActiveChat] = useState<Chat | null>(INITIAL_CHATS[0]);
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [callType, setCallType] = useState<CallType>(null);
  const [callContact, setCallContact] = useState<Contact | null>(null);

  const handleSendMessage = (text: string) => {
    if (!activeChat || !text.trim()) return;
    const newMsg: Message = {
      id: Date.now(),
      text,
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      outgoing: true,
      read: false,
    };
    setChats(prev =>
      prev.map(c =>
        c.id === activeChat.id
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: text, lastTime: newMsg.time }
          : c
      )
    );
    setActiveChat(prev =>
      prev ? { ...prev, messages: [...prev.messages, newMsg], lastMessage: text, lastTime: newMsg.time } : prev
    );
  };

  const handleSelectChat = (chat: Chat) => {
    setActiveChat(chat);
    setChats(prev => prev.map(c => (c.id === chat.id ? { ...c, unread: 0 } : c)));
    setSection("chats");
  };

  const handleCall = (type: CallType, contact: Contact) => {
    setCallType(type);
    setCallContact(contact);
  };

  const handleStartChatFromContact = (contact: Contact) => {
    const existing = chats.find(c => c.contact.id === contact.id);
    if (existing) {
      setActiveChat(existing);
    } else {
      const newChat: Chat = {
        id: Date.now(),
        contact,
        messages: [],
        lastMessage: "",
        lastTime: "",
        unread: 0,
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChat(newChat);
    }
    setSection("chats");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <div className="flex flex-1 overflow-hidden" style={{ paddingBottom: "60px" }}>
        {section === "chats" && (
          <>
            <ChatList chats={chats} activeChat={activeChat} onSelect={handleSelectChat} />
            <ChatWindow chat={activeChat} me={ME} onSend={handleSendMessage} onCall={handleCall} />
          </>
        )}
        {section === "contacts" && (
          <Contacts contacts={CONTACTS} onChat={handleStartChatFromContact} onCall={handleCall} />
        )}
        {section === "profile" && <Profile me={ME} />}
        {section === "settings" && <Settings me={ME} />}
      </div>

      <Sidebar
        section={section}
        onSection={setSection}
        me={ME}
        unreadTotal={chats.reduce((a, c) => a + c.unread, 0)}
      />

      {callType && callContact && (
        <CallModal
          type={callType}
          contact={callContact}
          onEnd={() => {
            setCallType(null);
            setCallContact(null);
          }}
        />
      )}
    </div>
  );
}