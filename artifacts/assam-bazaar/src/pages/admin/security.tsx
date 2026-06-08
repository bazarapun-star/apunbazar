import { useState, useEffect } from "react";
import { Shield, Eye, EyeOff, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { isAdminLoggedIn } from "@/lib/admin-auth";
import { useLocation } from "wouter";

export default function AdminSecurity() {
  const [, navigate] = useLocation();
  const { toast }    = useToast();

  const [oldPass,     setOldPass]     = useState("");
  const [newPass,     setNewPass]     = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showOld,     setShowOld]     = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState("");
  const [loading,     setLoading]     = useState(false);

  useEffect(() => { if (!isAdminLoggedIn()) navigate("/admin/login"); }, []);

  function getStrength(p: string) {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8)  s++;
    if (p.length >= 12) s++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  }

  const strength = getStrength(newPass);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][strength] ?? "";
  const strengthColor = ["", "#f87171", "#fb923c", "#facc15", "#4ade80", "#22c55e"][strength] ?? "";

  async function handleChange(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");

    // Validations — sab sahi hona chahiye
    if (!oldPass || !newPass || !confirmPass) { setError("Sab fields required hain"); return; }
    if (newPass.length < 8)                  { setError("Naya password minimum 8 characters ka hona chahiye"); return; }
    if (newPass !== confirmPass)             { setError("Naya password aur confirm password match nahi karte"); return; }
    if (oldPass === newPass)                 { setError("Naya password purane se alag hona chahiye"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSuccess(data.message ?? "Validation pass! Ab server pe ADMIN_PASSWORD env var update karo.");
        setOldPass(""); setNewPass(""); setConfirmPass("");
        toast({ title: "Password validation passed ✓" });
      } else {
        setError(data.error ?? "Password change failed");
      }
    } catch {
      setError("Server se connect nahi ho paya. API server chal raha hai?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold mb-1">Security Settings</h1>
        <p className="text-muted-foreground text-sm">Admin password change karo</p>
      </div>

      <Card className="p-4 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">Important</p>
            <p className="text-xs text-amber-700 dark:text-amber-500">
              Password change ke baad Railway/Vercel dashboard pe{" "}
              <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded font-mono">ADMIN_PASSWORD</code>{" "}
              env var update karna hoga aur server restart karna hoga.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <form onSubmit={handleChange} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Purana Password</label>
            <div className="relative">
              <Input type={showOld ? "text" : "password"} value={oldPass}
                onChange={e => { setOldPass(e.target.value); setError(""); }}
                placeholder="Current password" className="pr-10" />
              <button type="button" onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Naya Password</label>
            <div className="relative">
              <Input type={showNew ? "text" : "password"} value={newPass}
                onChange={e => { setNewPass(e.target.value); setError(""); }}
                placeholder="Minimum 8 characters" className="pr-10" />
              <button type="button" onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {newPass && (
              <div className="mt-1.5">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{ background: i <= strength ? strengthColor : "hsl(var(--muted))" }} />
                  ))}
                </div>
                <p className="text-xs" style={{ color: strengthColor }}>{strengthLabel}</p>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Confirm Naya Password</label>
            <Input type="password" value={confirmPass}
              onChange={e => { setConfirmPass(e.target.value); setError(""); }}
              placeholder="Repeat new password" />
            {confirmPass && newPass !== confirmPass && (
              <p className="text-xs text-destructive">Passwords match nahi karte</p>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg text-sm"
              style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", color: "hsl(var(--destructive))" }}>
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />{error}
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 p-3 rounded-lg text-sm bg-green-50 border border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400">
              <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />{success}
            </div>
          )}

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            <Shield className="h-4 w-4" />
            {loading ? "Verifying…" : "Password Change Karo"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
