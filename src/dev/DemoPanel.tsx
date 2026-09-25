import React, { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ClipboardCheck,
  FlaskConical,
  GraduationCap,
  Heart,
  LogOut,
  Map as MapIcon,
  PenLine,
  School,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Table2,
  Users,
  X,
  Bell,
  Globe,
} from "lucide-react";
import { useAuth, ROLE_DEFAULT_PATHS } from "../context/AuthContext";
import { useRouter } from "../context/RouterContext";
import { usePreferences, TEXT_SIZE_OPTIONS, TextSize, ThemeMode } from "../context/PreferencesContext";
import { ROUTE_CONFIGS } from "../routes";
import { UserRole } from "../types";
import { Badge, Button, IconTile, Modal, SegmentedControl, Tone, useToast } from "../components/ui";
import { ROLE_LABELS } from "../lib/format";
import { gsap, prefersReducedMotion } from "../lib/motion";
import { cn } from "../lib/cn";

// ============================================================================
// DEMO PANEL (02 §15) — công cụ trình diễn, tách khỏi UI sản phẩm (B-01, MIG-10)
// ============================================================================

const ROLE_OPTIONS: { role: UserRole; icon: React.ReactNode; tone: Tone }[] = [
  { role: "STUDENT", icon: <GraduationCap />, tone: "sky" },
  { role: "PARENT", icon: <Heart />, tone: "rose" },
  { role: "GLV", icon: <BookOpen />, tone: "mint" },
  { role: "ADMIN", icon: <ShieldCheck />, tone: "grape" },
];

const QUICK_LINKS: { label: string; path: string; icon: React.ReactNode }[] = [
  { label: "Điểm danh Rước Lễ 1A", path: "/classes/class-rl1a/attendance?date=2026-09-27", icon: <ClipboardCheck /> },
  { label: "Nhập điểm Rước Lễ 1A", path: "/classes/class-rl1a/scores?subject=giao_ly&type=MIENG", icon: <PenLine /> },
  { label: "Danh sách lớp", path: "/classes", icon: <School /> },
  { label: "Học sinh", path: "/students", icon: <Users /> },
  { label: "Thông báo", path: "/notifications", icon: <Bell /> },
  { label: "Góc thiếu nhi", path: "/student/portal", icon: <Sparkles /> },
];

const OWNERSHIP: { role: UserRole; scope: string; detail: string; tone: Tone }[] = [
  { role: "ADMIN", scope: "Toàn bộ dữ liệu", detail: "Tất cả lớp, học sinh, điểm danh, điểm số, tài khoản, cấu hình và nhật ký.", tone: "grape" },
  { role: "GLV", scope: "Lớp được phân công", detail: "Chỉ học sinh, điểm danh, điểm số của lớp mình phụ trách.", tone: "mint" },
  { role: "PARENT", scope: "Con được liên kết", detail: "Chỉ bảng điểm, chuyên cần và thông báo của các con.", tone: "rose" },
  { role: "STUDENT", scope: "Dữ liệu bản thân", detail: "Chỉ điểm số, chuyên cần, XP và huy hiệu của chính em.", tone: "sky" },
];

export const DemoPanel: React.FC = () => {
  const { role, isAuthenticated, switchRole, logout } = useAuth();
  const { navigate, fullPath } = useRouter();
  const { theme, setTheme, textSize, setTextSize, demoMode, setDemoMode, mobileFrame, setMobileFrame } = usePreferences();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [doc, setDoc] = useState<"routes" | "ownership" | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    if (panelRef.current && !prefersReducedMotion()) {
      gsap.fromTo(panelRef.current, { x: 32, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: "power3.out" });
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const goRole = (next: UserRole) => {
    switchRole(next);
    navigate(ROLE_DEFAULT_PATHS[next]);
    toast.info(`Đang xem với vai trò ${ROLE_LABELS[next]}`);
    setOpen(false);
  };

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      {/* Tab dọc ở mép phải — không che nội dung / thanh lưu */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Mở bảng điều khiển demo"
        className="fixed top-1/2 right-0 z-[80] flex -translate-y-1/2 flex-col items-center gap-1.5 rounded-l-control bg-night px-1.5 py-3 text-on-night shadow-float transition-[padding] hover:pr-2.5"
      >
        <FlaskConical className="size-4" aria-hidden="true" />
        <span className="text-xs font-semibold [writing-mode:vertical-rl]">Demo</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Bảng điều khiển demo">
          <div className="absolute inset-0 bg-night/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div
            ref={panelRef}
            className="absolute inset-y-3 right-3 flex w-[min(25rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-card-lg border border-line bg-surface shadow-float"
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
              <div>
                <p className="text-lg font-bold tracking-tight text-ink">Bảng điều khiển demo</p>
                <p className="text-sm text-ink-3">Công cụ trình diễn, không thuộc sản phẩm</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Đóng"
                className="inline-flex size-10 items-center justify-center rounded-full text-ink-2 hover:bg-surface-2"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
              <section className="space-y-2.5">
                <h3 className="text-sm font-semibold text-ink-2">Xem với vai trò</h3>
                <div className="grid grid-cols-2 gap-2">
                  {ROLE_OPTIONS.map((opt) => {
                    const active = isAuthenticated && role === opt.role;
                    return (
                      <button
                        key={opt.role}
                        type="button"
                        onClick={() => goRole(opt.role)}
                        aria-pressed={active}
                        className={cn(
                          "flex min-h-14 items-center gap-2.5 rounded-control border px-3 text-left text-sm font-semibold transition-colors",
                          active ? "border-transparent bg-night text-on-night" : "border-line bg-surface text-ink hover:bg-surface-2"
                        )}
                      >
                        <IconTile icon={opt.icon} tone={opt.tone} size="sm" />
                        {ROLE_LABELS[opt.role]}
                      </button>
                    );
                  })}
                </div>
              </section>

              {isAuthenticated && (
                <section className="space-y-2.5">
                  <h3 className="text-sm font-semibold text-ink-2">Lối tắt màn hình</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_LINKS.map((link) => (
                      <button
                        key={link.path}
                        type="button"
                        onClick={() => go(link.path)}
                        className="flex min-h-12 items-center gap-2 rounded-control bg-surface-2 px-3 text-left text-sm font-medium text-ink transition-colors hover:bg-surface-3 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-ink-3"
                      >
                        {link.icon}
                        <span className="truncate">{link.label}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-ink-2">Hiển thị</h3>
                <SegmentedControl<ThemeMode>
                  ariaLabel="Giao diện"
                  value={theme}
                  onChange={setTheme}
                  fullWidth
                  options={[
                    { value: "light", label: "Sáng" },
                    { value: "dark", label: "Tối" },
                  ]}
                />
                <SegmentedControl<TextSize>
                  ariaLabel="Cỡ chữ"
                  value={textSize}
                  onChange={setTextSize}
                  fullWidth
                  options={TEXT_SIZE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                />
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-ink-2">Công cụ</h3>
                <ToggleRow
                  icon={<FlaskConical />}
                  title="Chế độ demo"
                  description="Hiện công cụ test trong trang: giả lập lỗi mạng, checklist kiểm tra."
                  checked={demoMode}
                  onChange={setDemoMode}
                />
                <ToggleRow
                  icon={<Smartphone />}
                  title="Khung điện thoại 390px"
                  description="Xem app trong khung mobile thật (chỉ trên màn hình lớn)."
                  checked={mobileFrame}
                  onChange={setMobileFrame}
                  className="hidden lg:flex"
                />
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-ink-2">Tài liệu kỹ thuật</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" leftIcon={<Table2 />} onClick={() => setDoc("routes")}>
                    Bảng route
                  </Button>
                  <Button variant="outline" size="sm" leftIcon={<MapIcon />} onClick={() => setDoc("ownership")}>
                    Phân quyền
                  </Button>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-ink-2">Phiên</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Globe />}
                    onClick={() => {
                      logout();
                      go("/welcome");
                    }}
                  >
                    Trang giới thiệu
                  </Button>
                  {isAuthenticated && (
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<LogOut />}
                      className="text-danger"
                      onClick={() => {
                        logout();
                        go("/welcome");
                      }}
                    >
                      Đăng xuất
                    </Button>
                  )}
                </div>
              </section>
            </div>

            <div className="border-t border-line bg-surface-2 px-5 py-3">
              <p className="truncate font-mono text-xs text-ink-3" title={fullPath}>
                {fullPath}
              </p>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={doc === "routes"}
        onClose={() => setDoc(null)}
        title="Bảng route (URL convention)"
        description="Chữ thường, phân cấp theo tài nguyên, query cho bộ lọc."
        size="lg"
      >
        <div className="-mx-1 max-h-[60vh] overflow-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="sticky top-0 bg-surface-2 text-ink-2">
              <tr>
                <th className="px-3 py-2.5 font-semibold">Route</th>
                <th className="px-3 py-2.5 font-semibold">Màn hình</th>
                <th className="px-3 py-2.5 font-semibold">Vai trò</th>
                <th className="px-3 py-2.5 font-semibold">Quyền</th>
                <th className="px-3 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ROUTE_CONFIGS.map((cfg) => {
                const allowed = cfg.allowedRoles.includes(role);
                const sample = cfg.pattern.replace(":classId", "cls-7a").replace(":studentId", "stu-001");
                return (
                  <tr key={cfg.pattern} className="hover:bg-surface-2/60">
                    <td className="px-3 py-2.5 font-mono text-xs text-primary-ink">{cfg.pattern}</td>
                    <td className="px-3 py-2.5 font-medium text-ink">{cfg.name}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {cfg.allowedRoles.map((r) => (
                          <Badge key={r} size="sm" variant={r === role ? "night" : "neutral"}>
                            {r}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs text-ink-3">{cfg.requiredPermission ?? "—"}</td>
                    <td className="px-3 py-2.5 text-right">
                      <Button
                        size="sm"
                        variant={allowed ? "soft" : "ghost"}
                        onClick={() => {
                          setDoc(null);
                          go(sample);
                        }}
                      >
                        {allowed ? "Mở" : "Thử 403"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Modal>

      <Modal
        isOpen={doc === "ownership"}
        onClose={() => setDoc(null)}
        title="Phân quyền dữ liệu"
        description="Mỗi vai trò chỉ truy vấn đúng phạm vi dữ liệu được phép."
        size="lg"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {OWNERSHIP.map((item) => (
            <div key={item.role} className="rounded-card border border-line bg-surface-2 p-4">
              <div className="flex items-center gap-3">
                <IconTile icon={ROLE_OPTIONS.find((o) => o.role === item.role)?.icon} tone={item.tone} />
                <div>
                  <p className="font-semibold text-ink">{ROLE_LABELS[item.role]}</p>
                  <p className="text-sm text-ink-3">{item.scope}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-ink-2">{item.detail}</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

interface ToggleRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}

/** Hàng bật/tắt dạng switch (role="switch"). */
const ToggleRow: React.FC<ToggleRowProps> = ({ icon, title, description, checked, onChange, className }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={cn(
      "flex w-full items-center gap-3 rounded-control px-3 py-3 text-left transition-colors hover:bg-surface-2",
      className
    )}
  >
    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-control bg-surface-2 text-ink-2 [&_svg]:size-4">
      {icon}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-sm font-semibold text-ink">{title}</span>
      <span className="block text-sm text-ink-3">{description}</span>
    </span>
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors",
        checked ? "bg-primary" : "bg-surface-3"
      )}
    >
      <span
        className={cn(
          "size-6 rounded-full bg-surface shadow-xs transition-transform duration-200 ease-out-soft",
          checked && "translate-x-5"
        )}
      />
    </span>
  </button>
);
