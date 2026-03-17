import { useState, useEffect } from "react";
import { Contact, CallType } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface Props {
  type: CallType;
  contact: Contact;
  onEnd: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const AVATAR_COLORS = ["hsl(222,60%,35%)", "hsl(200,60%,35%)", "hsl(260,50%,40%)", "hsl(180,50%,32%)", "hsl(240,55%,38%)", "hsl(210,65%,32%)", "hsl(190,55%,30%)", "hsl(230,50%,38%)"];

export default function CallModal({ type, contact, onEnd }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOff, setSpeakerOff] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [phase, setPhase] = useState<"connecting" | "active">("connecting");

  const color = AVATAR_COLORS[contact.id % AVATAR_COLORS.length];

  useEffect(() => {
    const connectTimeout = setTimeout(() => setPhase("active"), 2000);
    return () => clearTimeout(connectTimeout);
  }, []);

  useEffect(() => {
    if (phase !== "active") return;
    const interval = setInterval(() => setElapsed(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ background: "rgba(10, 15, 30, 0.88)", backdropFilter: "blur(16px)" }}
    >
      <div
        className="relative rounded-3xl overflow-hidden flex flex-col items-center animate-scale-in"
        style={{
          background: "hsl(222, 50%, 12%)",
          border: "1px solid hsl(222, 40%, 20%)",
          width: type === "video" ? "480px" : "320px",
          minHeight: type === "video" ? "340px" : "280px",
          padding: "40px 32px 32px",
        }}
      >
        {/* Decorative rings */}
        {phase === "connecting" && (
          <>
            <div
              className="absolute rounded-full opacity-20 animate-ping"
              style={{ width: "160px", height: "160px", background: "hsl(210, 85%, 55%)", top: "16px", left: "50%", transform: "translateX(-50%)" }}
            />
            <div
              className="absolute rounded-full opacity-10"
              style={{ width: "200px", height: "200px", background: "hsl(210, 85%, 55%)", top: "-4px", left: "50%", transform: "translateX(-50%)" }}
            />
          </>
        )}

        {/* Video area */}
        {type === "video" && phase === "active" && (
          <div
            className="w-full rounded-2xl mb-5 flex items-center justify-center"
            style={{ height: "140px", background: "hsl(222, 45%, 18%)", border: "1px solid hsl(222, 40%, 22%)" }}
          >
            {cameraOff ? (
              <div className="flex flex-col items-center gap-2">
                <Icon name="VideoOff" size={24} style={{ color: "hsl(210, 20%, 50%)" } as React.CSSProperties} />
                <span className="text-xs" style={{ color: "hsl(210, 20%, 50%)" }}>Камера выключена</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                  style={{ background: color }}
                >
                  {contact.initials}
                </div>
                <span className="text-xs" style={{ color: "hsl(210, 20%, 60%)" }}>Видео подключается...</span>
              </div>
            )}
          </div>
        )}

        {/* Avatar */}
        <div className="relative mb-4">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
            style={{ background: color }}
          >
            {contact.initials}
          </div>
        </div>

        <h3 className="text-white font-bold text-lg mb-1">{contact.name}</h3>
        <p className="text-sm mb-1" style={{ color: "hsl(210, 20%, 60%)" }}>{contact.role}</p>
        <p
          className="text-sm font-medium mb-6"
          style={{ color: phase === "connecting" ? "hsl(210, 85%, 65%)" : "hsl(142, 60%, 50%)" }}
        >
          {phase === "connecting" ? "Вызов..." : formatTime(elapsed)}
        </p>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <CallBtn
            icon={muted ? "MicOff" : "Mic"}
            label={muted ? "Вкл. микр." : "Микрофон"}
            active={!muted}
            onClick={() => setMuted(!muted)}
          />
          {type === "video" && (
            <CallBtn
              icon={cameraOff ? "VideoOff" : "Video"}
              label={cameraOff ? "Вкл. камеру" : "Камера"}
              active={!cameraOff}
              onClick={() => setCameraOff(!cameraOff)}
            />
          )}
          <CallBtn
            icon={speakerOff ? "VolumeX" : "Volume2"}
            label={speakerOff ? "Вкл. звук" : "Динамик"}
            active={!speakerOff}
            onClick={() => setSpeakerOff(!speakerOff)}
          />
          <button
            onClick={onEnd}
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-150 hover:scale-105"
            style={{ background: "hsl(0, 72%, 51%)", color: "#fff" }}
            title="Завершить звонок"
          >
            <Icon name="PhoneOff" size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CallBtn({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 transition-all duration-150"
      title={label}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{
          background: active ? "hsl(222, 45%, 22%)" : "hsl(210, 85%, 55%, 0.2)",
          color: active ? "hsl(210, 20%, 75%)" : "hsl(210, 85%, 65%)",
        }}
      >
        <Icon name={icon} size={20} />
      </div>
      <span className="text-[9px]" style={{ color: "hsl(210, 20%, 50%)" }}>{label}</span>
    </button>
  );
}
