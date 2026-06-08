import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactUs() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast({ title: "Message bhej diya!", description: "Hum 24 ghante mein aapse contact karenge." });
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-16 px-4 text-center">
        <h1 className="font-serif text-4xl font-bold mb-4">Hum Se Milein</h1>
        <p className="text-primary-foreground/80 text-lg">
          Koi sawaal? Koi problem? Hum yahan hain aapke liye!
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary mb-6">Hamse Baat Karein</h2>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "support@apunbazar.in", href: "mailto:support@apunbazar.in" },
                  { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
                  { icon: MapPin, label: "Address", value: "Guwahati, Assam — 781001, India", href: null },
                  { icon: Clock, label: "Timing", value: "Mon–Sat: 9 AM – 6 PM IST", href: null },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 p-4 bg-card border rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="font-medium text-primary hover:underline">{item.value}</a>
                      ) : (
                        <p className="font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 rounded-2xl p-6">
              <h3 className="font-semibold mb-2">🚚 Order Related Sawaal?</h3>
              <p className="text-muted-foreground text-sm">
                Apna Order ID taiyaar rakhein. Hum 24 ghante mein aapki order ki status batayenge.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-primary mb-6">Message Bhejein</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Aapka Naam</label>
                  <Input
                    placeholder="Rahul Das"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input
                    type="email"
                    placeholder="rahul@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Subject</label>
                <Input
                  placeholder="Mera order kahan hai?"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Message</label>
                <Textarea
                  rows={5}
                  placeholder="Apni baat yahan likhein..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={sending}>
                {sending ? "Bhej raha hoon..." : "Message Bhejein"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}