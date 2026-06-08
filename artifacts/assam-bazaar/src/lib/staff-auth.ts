/**
 * staff-auth.ts — Role-Based Access Control (RBAC)
 * Staff sirf apne assigned permissions wale sections hi dekh sakta hai
 */

export type StaffRole =
  | "super_admin"
  | "admin"
  | "manager"
  | "delivery"
  | "marketing"
  | "support"
  | "custom";

export type Permission =
  | "dashboard"
  | "products"
  | "categories"
  | "orders"
  | "analytics"
  | "coupons"
  | "settings"
  | "security"
  | "slider"
  | "banners"
  | "staff"
  | "delivery"
  | "campaigns"
  | "support_tickets"
  | "reports";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  permissions: Permission[];
  avatar?: string;
  department: string;
  isActive: boolean;
  isBlocked: boolean;
  createdAt: string;
  lastLogin?: string;
  createdBy: string;
  whatsappNumber?: string;
  password: string;
}

export interface StaffActivity {
  id: string;
  staffId: string;
  staffName: string;
  action: string;
  details: string;
  page: string;
  timestamp: string;
}

export interface StaffSession {
  staffId: string;
  role: StaffRole;
  permissions: Permission[];
  name: string;
  email: string;
  loginTime: string;
}

// ── Role Permissions — clearly defined, limited by role ──────────────────────
export const ROLE_PERMISSIONS: Record<StaffRole, Permission[]> = {
  // Super Admin — sab kuch
  super_admin: [
    "dashboard","products","categories","orders","analytics",
    "coupons","settings","security","slider","banners",
    "staff","delivery","campaigns","support_tickets","reports",
  ],
  // Admin — security aur staff management nahi
  admin: [
    "dashboard","products","categories","orders","analytics",
    "coupons","settings","slider","banners","staff",
    "delivery","campaigns","support_tickets","reports",
  ],
  // Manager — operations manage karo, settings/security nahi
  manager: [
    "dashboard","products","categories","orders",
    "analytics","coupons","reports","delivery",
  ],
  // Delivery — sirf orders aur delivery
  delivery: [
    "dashboard","orders","delivery",
  ],
  // Marketing — content aur promotions
  marketing: [
    "dashboard","campaigns","banners","slider","analytics","coupons",
  ],
  // Support — sirf orders aur tickets
  support: [
    "dashboard","orders","support_tickets",
  ],
  // Custom — sirf dashboard, admin manually assign karega
  custom: [
    "dashboard",
  ],
};

export const ROLE_LABELS: Record<StaffRole, string> = {
  super_admin: "Super Admin",
  admin:       "Admin",
  manager:     "Manager",
  delivery:    "Delivery Staff",
  marketing:   "Marketing",
  support:     "Support",
  custom:      "Custom",
};

export const ROLE_COLORS: Record<StaffRole, string> = {
  super_admin: "#7c3aed",
  admin:       "#1a5c2a",
  manager:     "#0369a1",
  delivery:    "#c2410c",
  marketing:   "#be185d",
  support:     "#0f766e",
  custom:      "#6b7280",
};

// Role description — kya kar sakta hai
export const ROLE_DESCRIPTIONS: Record<StaffRole, string> = {
  super_admin: "Sab kuch — koi restriction nahi",
  admin:       "Almost sab kuch — security page nahi",
  manager:     "Products, categories, orders, analytics",
  delivery:    "Sirf orders aur delivery status",
  marketing:   "Banners, campaigns, coupons, analytics",
  support:     "Orders dekhna aur support tickets",
  custom:      "Admin manually permissions assign karega",
};

export const PERMISSION_LABELS: Record<Permission, string> = {
  dashboard:       "Dashboard",
  products:        "Products",
  categories:      "Categories",
  orders:          "Orders",
  analytics:       "Analytics",
  coupons:         "Coupons",
  settings:        "Settings",
  security:        "Security",
  slider:          "Hero Slider",
  banners:         "Banners",
  staff:           "Staff Mgmt",
  delivery:        "Delivery",
  campaigns:       "Campaigns",
  support_tickets: "Support",
  reports:         "Reports",
};

export const PERMISSION_GROUPS: { label: string; permissions: Permission[] }[] = [
  { label: "Core", permissions: ["dashboard", "orders", "products", "categories"] },
  { label: "Content", permissions: ["slider", "banners", "campaigns"] },
  { label: "Business", permissions: ["analytics", "reports", "coupons"] },
  { label: "Operations", permissions: ["delivery", "support_tickets"] },
  { label: "Admin Only", permissions: ["settings", "security", "staff"] },
];

// ── Storage keys ──────────────────────────────────────────────────────────────
const SK = {
  staff:      "apunbazar_staff_members",
  session:    "apunbazar_staff_session",
  activities: "apunbazar_staff_activities",
  attendance: "apunbazar_staff_attendance",
};

// ── Default staff ─────────────────────────────────────────────────────────────
const DEFAULT_STAFF: StaffMember[] = [
  {
    id: "staff_001",
    name: "Admin User",
    email: "admin@apunbazar.com",
    phone: "+91 9613000000",
    role: "super_admin",
    permissions: ROLE_PERMISSIONS.super_admin,
    department: "Management",
    isActive: true,
    isBlocked: false,
    createdAt: new Date().toISOString(),
    createdBy: "system",
    password: "admin123",
  },
];

// ── CRUD ──────────────────────────────────────────────────────────────────────
export function loadStaff(): StaffMember[] {
  try {
    const s = localStorage.getItem(SK.staff);
    if (s) { const p = JSON.parse(s); if (Array.isArray(p) && p.length) return p; }
  } catch {}
  return DEFAULT_STAFF;
}

export function saveStaff(staff: StaffMember[]): void {
  localStorage.setItem(SK.staff, JSON.stringify(staff));
}

export function addStaffMember(member: Omit<StaffMember, "id" | "createdAt">): StaffMember {
  const staff = loadStaff();
  // Enforce role-based permissions — staff apne role se zyada permissions nahi le sakta
  const maxPermissions = ROLE_PERMISSIONS[member.role];
  const safePermissions = member.permissions.filter(p => maxPermissions.includes(p));

  const newMember: StaffMember = {
    ...member,
    permissions: safePermissions,
    id: `staff_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  saveStaff([...staff, newMember]);
  return newMember;
}

export function updateStaffMember(id: string, updates: Partial<StaffMember>): void {
  const staff = loadStaff();
  saveStaff(staff.map(s => {
    if (s.id !== id) return s;
    const updated = { ...s, ...updates };
    // Role change hone pe permissions bhi reset karo
    if (updates.role && updates.role !== s.role) {
      updated.permissions = ROLE_PERMISSIONS[updates.role];
    }
    // Custom permissions validate karo — role ki boundary se bahar nahi
    if (updates.permissions) {
      const maxPerms = ROLE_PERMISSIONS[updated.role];
      updated.permissions = updates.permissions.filter(p => maxPerms.includes(p));
    }
    return updated;
  }));
}

export function deleteStaffMember(id: string): void {
  const staff = loadStaff();
  // Default super_admin delete nahi ho sakta
  const member = staff.find(s => s.id === id);
  if (member?.id === "staff_001") return;
  saveStaff(staff.filter(s => s.id !== id));
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export function staffLogin(email: string, password: string): StaffMember | null {
  const staff = loadStaff();
  const member = staff.find(s => s.email === email && s.password === password);
  if (!member || member.isBlocked || !member.isActive) return null;

  const session: StaffSession = {
    staffId:     member.id,
    role:        member.role,
    // Only save permissions that are within the role's allowed set
    permissions: member.permissions.filter(p => ROLE_PERMISSIONS[member.role].includes(p)),
    name:        member.name,
    email:       member.email,
    loginTime:   new Date().toISOString(),
  };
  localStorage.setItem(SK.session, JSON.stringify(session));
  updateStaffMember(member.id, { lastLogin: new Date().toISOString() });
  logActivity(member.id, member.name, "LOGIN", "Staff logged in", "login");
  logAttendance(member.id);
  return member;
}

export function staffLogout(): void {
  const s = getStaffSession();
  if (s) logActivity(s.staffId, s.name, "LOGOUT", "Staff logged out", "logout");
  localStorage.removeItem(SK.session);
}

export function getStaffSession(): StaffSession | null {
  try {
    const s = localStorage.getItem(SK.session);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export function isStaffLoggedIn(): boolean {
  return !!getStaffSession();
}

// Permission check — session mein hai ya nahi
export function hasPermission(permission: Permission): boolean {
  const session = getStaffSession();
  if (!session) return false;
  // Super admin always has all permissions
  if (session.role === "super_admin") return true;
  return session.permissions.includes(permission);
}

// Check multiple permissions (any one)
export function hasAnyPermission(...permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(p));
}

// Check multiple permissions (all required)
export function hasAllPermissions(...permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(p));
}

// ── Activity Log ──────────────────────────────────────────────────────────────
export function loadActivities(): StaffActivity[] {
  try {
    const s = localStorage.getItem(SK.activities);
    return s ? JSON.parse(s) : [];
  } catch { return []; }
}

export function logActivity(
  staffId: string, staffName: string,
  action: string, details: string, page: string
): void {
  const activities = loadActivities();
  const entry: StaffActivity = {
    id: `act_${Date.now()}`,
    staffId, staffName, action, details, page,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(SK.activities, JSON.stringify([entry, ...activities].slice(0, 500)));
}

// ── Attendance ────────────────────────────────────────────────────────────────
export interface AttendanceRecord {
  staffId: string; date: string; loginTime: string;
  logoutTime?: string; hoursWorked?: number;
  status: "present" | "absent" | "half_day";
}

export function logAttendance(staffId: string): void {
  const today = new Date().toISOString().split("T")[0];
  const records: AttendanceRecord[] = JSON.parse(localStorage.getItem(SK.attendance) || "[]");
  if (!records.find(r => r.staffId === staffId && r.date === today)) {
    records.push({ staffId, date: today, loginTime: new Date().toISOString(), status: "present" });
    localStorage.setItem(SK.attendance, JSON.stringify(records));
  }
}

export function loadAttendance(): AttendanceRecord[] {
  try { return JSON.parse(localStorage.getItem(SK.attendance) || "[]"); }
  catch { return []; }
}
