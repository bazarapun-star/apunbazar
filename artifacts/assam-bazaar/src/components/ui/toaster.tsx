import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

const ICONS: Record<string, string> = {
  default: "🛍️",
  destructive: "❌",
  success: "✅",
}

const COLORS: Record<string, { bg: string; border: string; icon_bg: string; bar: string }> = {
  default: {
    bg: "linear-gradient(135deg, #1a3a2e 0%, #2d5a3e 100%)",
    border: "rgba(201,168,76,0.3)",
    icon_bg: "rgba(201,168,76,0.15)",
    bar: "#c9a84c",
  },
  destructive: {
    bg: "linear-gradient(135deg, #3a1a1a 0%, #5a2d2d 100%)",
    border: "rgba(224,92,42,0.3)",
    icon_bg: "rgba(224,92,42,0.15)",
    bar: "#e05c2a",
  },
  success: {
    bg: "linear-gradient(135deg, #1a3a2e 0%, #2d5a3e 100%)",
    border: "rgba(122,182,72,0.4)",
    icon_bg: "rgba(122,182,72,0.15)",
    bar: "#7ab648",
  },
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      <style>{`
        @keyframes ap-toast-in {
          from { opacity: 0; transform: translateY(16px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes ap-toast-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(8px) scale(0.95); }
        }
        @keyframes ap-bar {
          from { width: 100%; }
          to   { width: 0%;   }
        }
        @keyframes ap-shine {
          0%   { left: -60%; }
          100% { left: 160%; }
        }
        .ap-toast-wrap {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px 16px;
          border-radius: 16px;
          border: 1px solid;
          overflow: hidden;
          min-width: 260px;
          max-width: 320px;
          animation: ap-toast-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
          box-shadow: 0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15);
          pointer-events: auto;
        }
        .ap-toast-wrap[data-state="closed"] {
          animation: ap-toast-out 0.25s ease forwards;
        }
        .ap-shine {
          position: absolute;
          top: 0; bottom: 0;
          width: 50%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          animation: ap-shine 3s ease-in-out infinite;
          pointer-events: none;
        }
        .ap-icon-wrap {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .ap-toast-title {
          font-family: 'Playfair Display', serif;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          line-height: 1.3;
          margin-bottom: 2px;
        }
        .ap-toast-desc {
          font-size: 11px;
          color: rgba(255,255,255,0.65);
          line-height: 1.4;
          font-family: sans-serif;
        }
        .ap-close {
          position: absolute;
          top: 10px; right: 10px;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 50%;
          width: 20px; height: 20px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: rgba(255,255,255,0.6);
          font-size: 11px;
          transition: background 0.2s;
        }
        .ap-close:hover { background: rgba(255,255,255,0.2); }
        .ap-bar {
          position: absolute;
          bottom: 0; left: 0;
          height: 3px;
          border-radius: 0 0 16px 16px;
          animation: ap-bar 4s linear forwards;
        }
        .ap-gamusa {
          position: absolute;
          bottom: 3px; left: 0; right: 0;
          height: 3px;
          opacity: 0.2;
          background: repeating-linear-gradient(
            90deg,
            #fff 0, #fff 4px,
            transparent 4px, transparent 8px,
            #c9a84c 8px, #c9a84c 10px,
            transparent 10px, transparent 14px
          );
        }
      `}</style>

      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const type = (variant as string) ?? "default"
        const col = COLORS[type] ?? COLORS.default
        const icon = ICONS[type] ?? ICONS.default

        return (
          <Toast key={id} {...props} asChild>
            <div
              className="ap-toast-wrap"
              style={{
                background: col.bg,
                borderColor: col.border,
              }}
            >
              {/* Shine sweep */}
              <div className="ap-shine" />

              {/* Icon */}
              <div className="ap-icon-wrap" style={{ background: col.icon_bg }}>
                {icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1, paddingRight: 20 }}>
                {title && <div className="ap-toast-title">{title}</div>}
                {description && <div className="ap-toast-desc">{description}</div>}
                {action}
              </div>

              {/* Close */}
              <ToastClose asChild>
                <button className="ap-close">✕</button>
              </ToastClose>

              {/* Progress bar */}
              <div className="ap-bar" style={{ background: col.bar }} />

              {/* Gamusa pattern */}
              <div className="ap-gamusa" />
            </div>
          </Toast>
        )
      })}

      <ToastViewport
        style={{
          position: "fixed",
          bottom: 80,
          right: 16,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          outline: "none",
          listStyle: "none",
          padding: 0,
          margin: 0,
          pointerEvents: "none",
        }}
      />
    </ToastProvider>
  )
}
