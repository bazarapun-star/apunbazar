// TrustBadges — add to home page + product detail page
import { motion } from "framer-motion";

const BADGES = [
  { icon: "🚚", title: "Free Shipping", sub: "Orders above ₹999" },
  { icon: "🌿", title: "100% Authentic", sub: "Direct from artisans" },
  { icon: "↩️", title: "Easy Returns", sub: "7-day return policy" },
  { icon: "🔒", title: "Secure Payment", sub: "Razorpay encrypted" },
  { icon: "📞", title: "24/7 Support", sub: "WhatsApp + Email" },
];

export function TrustBadges({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`${compact ? "py-4" : "py-8 md:py-12"}`}>
      <div className={`flex ${compact ? "flex-wrap" : "flex-col sm:flex-row"} items-center justify-center gap-4 md:gap-6`}>
        {BADGES.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`flex items-center gap-3 ${compact ? "text-sm" : ""}`}
          >
            <div
              className={`${compact ? "w-9 h-9 text-base" : "w-11 h-11 text-xl"} rounded-full flex items-center justify-center flex-shrink-0`}
              style={{ background: "rgba(26,92,42,0.08)" }}
            >
              {b.icon}
            </div>
            <div>
              <p className={`font-semibold leading-tight ${compact ? "text-xs" : "text-sm"}`}>{b.title}</p>
              <p className={`text-muted-foreground ${compact ? "text-[10px]" : "text-xs"}`}>{b.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
