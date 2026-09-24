import { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  BookOpen, 
  HeartHandshake, 
  Award, 
  Layers, 
  Palette, 
  Type, 
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { BREAKPOINT_STRINGS } from './styles/theme';

type ViewMode = 'all-tokens' | 'role-preview' | 'ui-states';
type UIState = 'loading' | 'empty' | 'error' | 'success';
type RoleDensity = 'admin' | 'glv' | 'parent' | 'student';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewMode>('all-tokens');
  const [uiState, setUiState] = useState<UIState>('success');
  const [roleDensity, setRoleDensity] = useState<RoleDensity>('parent');

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-primary)] flex flex-col font-sans">
      {/* Global Header */}
      <header className="sticky top-0 z-[var(--z-header)] bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)] shadow-xs">
        <div className="max-w-[var(--container-wide)] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white flex items-center justify-center font-serif font-bold text-xl shadow-sm">
              ✝
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold font-serif text-[var(--color-text-primary)] leading-tight">
                Đoàn Kitô Vua
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)] font-sans">
                Design System & Tokens (§28 Complete Source)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-success-50)] text-[var(--color-success-600)] border border-[var(--color-success-100)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse"></span>
              Tokens Active
            </span>
            <div className="flex bg-[var(--color-neutral-100)] p-1 rounded-[var(--radius-md)] text-xs font-medium">
              <button 
                onClick={() => setActiveTab('all-tokens')}
                className={`px-3 py-1.5 rounded-[var(--radius-sm)] transition-colors min-h-[36px] flex items-center gap-1.5 ${
                  activeTab === 'all-tokens' 
                    ? 'bg-white text-[var(--color-primary)] font-semibold shadow-xs' 
                    : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)]'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Design</span> Tokens
              </button>
              <button 
                onClick={() => setActiveTab('role-preview')}
                className={`px-3 py-1.5 rounded-[var(--radius-sm)] transition-colors min-h-[36px] flex items-center gap-1.5 ${
                  activeTab === 'role-preview' 
                    ? 'bg-white text-[var(--color-primary)] font-semibold shadow-xs' 
                    : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mật độ vai trò
              </button>
              <button 
                onClick={() => setActiveTab('ui-states')}
                className={`px-3 py-1.5 rounded-[var(--radius-sm)] transition-colors min-h-[36px] flex items-center gap-1.5 ${
                  activeTab === 'ui-states' 
                    ? 'bg-white text-[var(--color-primary)] font-semibold shadow-xs' 
                    : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Trạng thái UI
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[var(--container-wide)] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {activeTab === 'all-tokens' && <AllTokensSection />}
        {activeTab === 'role-preview' && (
          <RoleDensitySection 
            roleDensity={roleDensity} 
            setRoleDensity={setRoleDensity} 
          />
        )}
        {activeTab === 'ui-states' && (
          <UIStatesSection 
            uiState={uiState} 
            setUiState={setUiState} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-default)] bg-[var(--color-bg-surface)] py-6 text-center text-xs text-[var(--color-text-secondary)]">
        <p>Hệ thống Quản lý Học tập Giáo lý – Đoàn Kitô Vua • Thiết kế chuẩn hóa theo Design Tokens v1.0</p>
      </footer>
    </div>
  );
}

/* ==========================================================================
   TAB 1: ALL TOKENS SHOWCASE (Colors, Typography, Spacing, Radius, etc.)
   ========================================================================== */
function AllTokensSection() {
  return (
    <div className="space-y-10">
      {/* Hero Notice */}
      <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[var(--color-neutral-900)]">
              Kiểm Tra Nguồn Token Hoàn Chỉnh (§28)
            </h2>
            <p className="text-sm text-[var(--color-neutral-600)] mt-1">
              Đồng bộ 100% giữa <code className="text-xs bg-[var(--color-neutral-100)] px-2 py-0.5 rounded font-mono">tokens.css</code>, <code className="text-xs bg-[var(--color-neutral-100)] px-2 py-0.5 rounded font-mono">tailwind.config.js</code> và <code className="text-xs bg-[var(--color-neutral-100)] px-2 py-0.5 rounded font-mono">theme.ts</code>.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 bg-[var(--color-primary-50)] text-[var(--color-primary-700)] rounded-md font-semibold border border-[var(--color-primary-200)]">
              Primary Red: #B4232C
            </span>
            <span className="px-3 py-1 bg-[var(--color-gold-50)] text-[var(--color-gold-800)] rounded-md font-semibold border border-[var(--color-gold-200)]">
              Brand Gold: #E3B341
            </span>
          </div>
        </div>
      </div>

      {/* 1. Color Palettes */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-[var(--color-border-default)] pb-2">
          <Palette className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-lg font-bold font-serif text-[var(--color-neutral-800)]">
            1. Bảng Màu Hệ Thống
          </h3>
        </div>

        {/* Primary Red */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-[var(--color-neutral-600)]">
            <span>Primary Red (Brand: 600 #B4232C)</span>
            <span className="font-mono">--color-primary-50 .. 900</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
            {[
              { shade: '50', hex: '#FFF1F2', textDark: true },
              { shade: '100', hex: '#FFE4E6', textDark: true },
              { shade: '200', hex: '#FECDD3', textDark: true },
              { shade: '300', hex: '#FDA4AF', textDark: true },
              { shade: '400', hex: '#FB7185', textDark: false },
              { shade: '500', hex: '#D64550', textDark: false },
              { shade: '600', hex: '#B4232C', textDark: false, isBrand: true },
              { shade: '700', hex: '#941D25', textDark: false },
              { shade: '800', hex: '#7A1A21', textDark: false },
              { shade: '900', hex: '#641A1E', textDark: false },
            ].map(item => (
              <div 
                key={item.shade} 
                className="p-3 rounded-[var(--radius-md)] flex flex-col justify-between h-20 shadow-xs border border-black/5"
                style={{ backgroundColor: `var(--color-primary-${item.shade})` }}
              >
                <div className={`text-xs font-bold ${item.textDark ? 'text-neutral-900' : 'text-white'}`}>
                  {item.shade} {item.isBrand && '★'}
                </div>
                <div className={`text-[10px] font-mono ${item.textDark ? 'text-neutral-700' : 'text-white/90'}`}>
                  {item.hex}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Gold */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-[var(--color-neutral-600)]">
            <span>Brand Gold (Accent / Huy hiệu / Thành tích: 500 #E3B341)</span>
            <span className="font-mono">--color-gold-50 .. 800</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
            {[
              { shade: '50', hex: '#FFFBEB', textDark: true },
              { shade: '100', hex: '#FEF3C7', textDark: true },
              { shade: '200', hex: '#FDE68A', textDark: true },
              { shade: '300', hex: '#FCD34D', textDark: true },
              { shade: '400', hex: '#F4C95D', textDark: true },
              { shade: '500', hex: '#E3B341', textDark: true, isBrand: true },
              { shade: '600', hex: '#C99526', textDark: false },
              { shade: '700', hex: '#A87917', textDark: false },
              { shade: '800', hex: '#8B6419', textDark: false },
            ].map(item => (
              <div 
                key={item.shade} 
                className="p-3 rounded-[var(--radius-md)] flex flex-col justify-between h-20 shadow-xs border border-black/5"
                style={{ backgroundColor: `var(--color-gold-${item.shade})` }}
              >
                <div className={`text-xs font-bold ${item.textDark ? 'text-neutral-900' : 'text-white'}`}>
                  {item.shade} {item.isBrand && '★'}
                </div>
                <div className={`text-[10px] font-mono ${item.textDark ? 'text-neutral-700' : 'text-white/90'}`}>
                  {item.hex}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Semantic & Gamification Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Semantic */}
          <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] space-y-3">
            <h4 className="text-sm font-bold text-[var(--color-neutral-800)]">Semantic Status (§6)</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--color-success-50)] text-[var(--color-success-700)] border border-[var(--color-success-100)] flex items-center justify-between">
                <span>Success (Có mặt)</span>
                <span className="font-mono font-bold">#168154</span>
              </div>
              <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--color-error-50)] text-[var(--color-error-700)] border border-[var(--color-error-100)] flex items-center justify-between">
                <span>Error (Vắng)</span>
                <span className="font-mono font-bold">#C73A3A</span>
              </div>
              <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--color-warning-50)] text-[var(--color-warning-700)] border border-[var(--color-warning-100)] flex items-center justify-between">
                <span>Warning (Phép)</span>
                <span className="font-mono font-bold">#B86F08</span>
              </div>
              <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--color-info-50)] text-[var(--color-info-700)] border border-[var(--color-info-100)] flex items-center justify-between">
                <span>Info (Thông tin)</span>
                <span className="font-mono font-bold">#2563EB</span>
              </div>
            </div>
          </div>

          {/* Gamification */}
          <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] space-y-3">
            <h4 className="text-sm font-bold text-[var(--color-neutral-800)]">Gamification (§7)</h4>
            <div className="grid grid-cols-3 gap-2 text-xs text-white">
              <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--game-purple)] flex flex-col justify-between h-16 shadow-xs">
                <span className="font-semibold text-[11px]">XP / Level</span>
                <span className="text-[10px] font-mono">#7C5CFC</span>
              </div>
              <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--game-blue)] flex flex-col justify-between h-16 shadow-xs">
                <span className="font-semibold text-[11px]">Mission</span>
                <span className="text-[10px] font-mono">#3B82F6</span>
              </div>
              <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--game-cyan)] flex flex-col justify-between h-16 shadow-xs">
                <span className="font-semibold text-[11px]">Progress</span>
                <span className="text-[10px] font-mono">#18B7C9</span>
              </div>
              <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--game-orange)] flex flex-col justify-between h-16 shadow-xs">
                <span className="font-semibold text-[11px]">Streak</span>
                <span className="text-[10px] font-mono">#F28C28</span>
              </div>
              <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--game-gold)] text-neutral-900 flex flex-col justify-between h-16 shadow-xs">
                <span className="font-semibold text-[11px]">Achievement</span>
                <span className="text-[10px] font-mono">#E3B341</span>
              </div>
              <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--game-pink)] flex flex-col justify-between h-16 shadow-xs">
                <span className="font-semibold text-[11px]">Accent</span>
                <span className="text-[10px] font-mono">#E86A92</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Typography & Fonts */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[var(--color-border-default)] pb-2">
          <Type className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-lg font-bold font-serif text-[var(--color-neutral-800)]">
            2. Typography (§9–11)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Serif Heading */}
          <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] space-y-3">
            <div className="flex justify-between items-baseline border-b border-[var(--color-neutral-100)] pb-2">
              <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">Heading Font</span>
              <span className="text-xs text-[var(--color-text-secondary)] font-mono">Noto Serif / Source Serif 4</span>
            </div>
            <div className="space-y-2">
              <p className="text-[28px] font-serif font-bold text-[var(--color-neutral-900)] leading-tight">
                Quản lý Giáo lý Kitô Vua (28px H1)
              </p>
              <p className="text-[24px] font-serif font-bold text-[var(--color-neutral-800)] leading-tight">
                Bảng Điểm Danh Lớp Học (24px H2)
              </p>
              <p className="text-[20px] font-serif font-bold text-[var(--color-neutral-800)] leading-tight">
                Thành Tích Và Chuyên Cần (20px H3)
              </p>
            </div>
          </div>

          {/* Sans Body */}
          <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] space-y-3">
            <div className="flex justify-between items-baseline border-b border-[var(--color-neutral-100)] pb-2">
              <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">Body Font</span>
              <span className="text-xs text-[var(--color-text-secondary)] font-mono">Inter / Noto Sans</span>
            </div>
            <div className="space-y-2">
              <p className="text-[18px] text-[var(--color-neutral-800)] leading-relaxed">
                <strong className="font-semibold">Body Large (18px):</strong> Dành riêng cho Phụ huynh và người lớn tuổi đọc dễ dàng, độ tương phản cao.
              </p>
              <p className="text-[16px] text-[var(--color-neutral-700)] leading-normal">
                <strong className="font-semibold">Body Medium (16px):</strong> Cỡ chữ tiêu chuẩn cho toàn bộ giao diện và form nhập liệu GLV.
              </p>
              <p className="text-[14px] text-[var(--color-neutral-600)] leading-normal">
                <strong className="font-semibold">Body Small (14px):</strong> Chú thích, thông tin phụ trợ và dòng thời gian hoạt động.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Spacing, Radius, Touch Targets & Breakpoints */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Spacing */}
        <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] space-y-3">
          <h4 className="text-sm font-bold text-[var(--color-neutral-800)]">Hệ thống Spacing (Base 4px)</h4>
          <div className="space-y-1.5 text-xs">
            {[
              { name: '--space-1', val: '4px', w: 'w-1' },
              { name: '--space-2', val: '8px', w: 'w-2' },
              { name: '--space-3', val: '12px', w: 'w-3' },
              { name: '--space-4', val: '16px', w: 'w-4' },
              { name: '--space-6', val: '24px', w: 'w-6' },
              { name: '--space-8', val: '32px', w: 'w-8' },
            ].map(s => (
              <div key={s.name} className="flex items-center justify-between py-1 border-b border-[var(--color-neutral-100)]">
                <span className="font-mono text-[var(--color-neutral-700)]">{s.name} ({s.val})</span>
                <div className="h-3 bg-[var(--color-primary)] rounded-xs" style={{ width: s.val }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Touch Targets */}
        <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] space-y-3">
          <h4 className="text-sm font-bold text-[var(--color-neutral-800)]">Touch Targets (WCAG Accessible)</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-[var(--color-neutral-50)] border border-[var(--color-border-default)]">
              <span>Admin Min (44px)</span>
              <div className="h-[44px] px-3 bg-[var(--color-primary-600)] text-white rounded font-bold flex items-center justify-center text-xs">
                44px
              </div>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[var(--color-neutral-50)] border border-[var(--color-border-default)]">
              <span>GLV Fast Input (52px)</span>
              <div className="h-[52px] px-3 bg-[var(--color-primary-700)] text-white rounded font-bold flex items-center justify-center text-xs">
                52px
              </div>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[var(--color-neutral-50)] border border-[var(--color-border-default)]">
              <span>Parent Large (56px)</span>
              <div className="h-[56px] px-3 bg-[var(--color-primary-800)] text-white rounded font-bold flex items-center justify-center text-xs">
                56px
              </div>
            </div>
          </div>
        </div>

        {/* Breakpoints */}
        <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] space-y-3">
          <h4 className="text-sm font-bold text-[var(--color-neutral-800)]">Breakpoints (--breakpoint-*)</h4>
          <div className="space-y-2 text-xs">
            {Object.entries(BREAKPOINT_STRINGS).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between py-1.5 border-b border-[var(--color-neutral-100)]">
                <span className="font-bold text-[var(--color-primary)]">sm-{key}</span>
                <span className="font-mono bg-[var(--color-neutral-100)] px-2 py-0.5 rounded text-[var(--color-neutral-700)]">
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   TAB 2: ROLE-BASED DENSITY (§25: Admin, GLV, Parent, Student)
   ========================================================================== */
function RoleDensitySection({ 
  roleDensity, 
  setRoleDensity 
}: { 
  roleDensity: RoleDensity; 
  setRoleDensity: (r: RoleDensity) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] shadow-xs">
        <div>
          <h2 className="text-lg font-bold font-serif text-[var(--color-neutral-900)]">
            Mật Độ Giao Diện Theo Vai Trò Người Dùng (§25)
          </h2>
          <p className="text-xs text-[var(--color-neutral-600)]">
            Tối ưu hóa UI/UX: Admin (Compact), GLV (Fast Input 52px), Phụ huynh (Spacious 18px / 56px), Học sinh (Gamified).
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[var(--color-neutral-100)] rounded-[var(--radius-md)] text-xs font-semibold">
          {[
            { id: 'admin', label: 'Admin (Gọn)', icon: ShieldCheck },
            { id: 'glv', label: 'GLV (52px)', icon: BookOpen },
            { id: 'parent', label: 'Phụ huynh (18px)', icon: HeartHandshake },
            { id: 'student', label: 'Học sinh (XP)', icon: Award },
          ].map(item => {
            const Icon = item.icon;
            const active = roleDensity === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setRoleDensity(item.id as RoleDensity)}
                className={`min-h-[44px] px-3 py-2 rounded-[var(--radius-sm)] flex items-center justify-center gap-1.5 transition-all ${
                  active 
                    ? 'bg-white text-[var(--color-primary)] shadow-xs font-bold' 
                    : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Preview Container */}
      <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] shadow-sm">
        {roleDensity === 'parent' && (
          <div className="space-y-6">
            <div className="border-b border-[var(--color-border-default)] pb-4">
              <span className="text-xs font-semibold px-2.5 py-1 bg-[var(--color-gold-100)] text-[var(--color-gold-800)] rounded-full">
                Parent Mode (Elder-friendly • Font 18px • Control 56px)
              </span>
              <h3 className="text-2xl font-serif font-bold text-[var(--color-neutral-900)] mt-2">
                Con đang xem: Maria Nguyễn An (Lớp 7A)
              </h3>
              <p className="text-[18px] text-[var(--color-neutral-600)] leading-relaxed mt-1">
                Kính gửi quý phụ huynh, dưới đây là kết quả học tập và chuyên cần mới nhất của con.
              </p>
            </div>

            {/* GPA Card - Spacious & High Contrast */}
            <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-gold-50)] border-2 border-[var(--color-gold-200)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-sm font-bold uppercase tracking-wider text-[var(--color-gold-800)]">
                  Điểm trung bình học kỳ I
                </span>
                <div className="text-4xl sm:text-5xl font-serif font-bold text-[var(--color-neutral-900)] mt-1">
                  8.5 <span className="text-lg font-sans font-medium text-[var(--color-success-700)]">/ 10 (Xếp loại: Tốt)</span>
                </div>
              </div>
              <button className="w-full sm:w-auto min-h-[56px] px-8 rounded-[var(--radius-md)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-[18px] font-bold shadow-md transition-colors flex items-center justify-center gap-2">
                <span>Xem chi tiết môn học</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Attendance Summary */}
            <div className="p-5 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-neutral-50)] space-y-3">
              <div className="flex justify-between items-center text-[18px] font-bold">
                <span>Tỷ lệ chuyên cần</span>
                <span className="text-[var(--color-success-700)]">94% (18/20 buổi)</span>
              </div>
              <div className="w-full h-4 bg-[var(--color-neutral-200)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-success)] rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </div>
        )}

        {roleDensity === 'glv' && (
          <div className="space-y-4">
            <div className="border-b border-[var(--color-border-default)] pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-[var(--color-primary-100)] text-[var(--color-primary-800)] rounded">
                  GLV Fast Input Mode (Touch-target 52px • Row height 60px)
                </span>
                <h3 className="text-xl font-serif font-bold text-[var(--color-neutral-900)] mt-1">
                  Điểm danh nhanh lớp 7A — 24/09/2026
                </h3>
              </div>
              <div className="flex gap-2">
                <button className="min-h-[44px] px-3 bg-[var(--color-success-50)] text-[var(--color-success-700)] border border-[var(--color-success-200)] rounded text-xs font-semibold hover:bg-[var(--color-success-100)]">
                  ✓ Tất cả có mặt
                </button>
              </div>
            </div>

            {/* Fast Input Rows */}
            <div className="space-y-2">
              {[
                { stt: '01', name: 'Nguyễn Văn An', status: 'PRESENT', label: 'Có mặt', color: 'bg-[var(--color-success)]' },
                { stt: '02', name: 'Trần Văn Bình', status: 'ABSENT', label: 'Vắng', color: 'bg-[var(--color-error)]' },
                { stt: '03', name: 'Lê Minh C', status: 'EXCUSED', label: 'Có phép', color: 'bg-[var(--color-warning)]' },
              ].map(st => (
                <div 
                  key={st.stt}
                  className="min-h-[60px] p-2.5 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-white flex items-center justify-between gap-3 shadow-xs hover:border-[var(--color-primary-300)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[var(--color-neutral-400)]">{st.stt}</span>
                    <span className="text-sm font-semibold text-[var(--color-neutral-900)]">{st.name}</span>
                  </div>
                  {/* Status Picker with 52px Touch Target */}
                  <div className="flex gap-1.5">
                    {['Có mặt', 'Vắng', 'Phép'].map((lbl) => {
                      const isSel = lbl === st.label;
                      return (
                        <button
                          key={lbl}
                          className={`min-h-[44px] min-w-[52px] px-3 rounded-[var(--radius-sm)] text-xs font-semibold transition-all ${
                            isSel
                              ? lbl === 'Có mặt'
                                ? 'bg-[var(--color-success)] text-white shadow-xs'
                                : lbl === 'Vắng'
                                ? 'bg-[var(--color-error)] text-white shadow-xs'
                                : 'bg-[var(--color-warning)] text-white shadow-xs'
                              : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-200)]'
                          }`}
                        >
                          {lbl}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Save Bar */}
            <div className="p-3 bg-[var(--color-neutral-100)] rounded-[var(--radius-md)] flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--color-neutral-600)]">Đã cập nhật 28/28 học sinh</span>
              <button className="min-h-[48px] px-6 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] font-bold text-sm shadow hover:bg-[var(--color-primary-hover)]">
                Lưu điểm danh
              </button>
            </div>
          </div>
        )}

        {roleDensity === 'admin' && (
          <div className="space-y-4">
            <div className="border-b border-[var(--color-border-default)] pb-3">
              <span className="text-xs font-semibold px-2 py-0.5 bg-[var(--color-neutral-200)] text-[var(--color-neutral-800)] rounded">
                Admin Mode (Compact • Font 14–16px • Control 44–48px)
              </span>
              <h3 className="text-xl font-serif font-bold text-[var(--color-neutral-900)] mt-1">
                Tổng quan Hệ thống Giáo xứ — Đoàn Kitô Vua
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { title: 'Tổng học sinh', val: '128', change: '+5 so với tháng trước' },
                { title: 'Lớp học', val: '12', change: '4 phân đoàn' },
                { title: 'Giáo lý viên', val: '18', change: 'Đủ nhân sự' },
                { title: 'Tỷ lệ đi học', val: '94%', change: 'Hôm nay' },
              ].map(k => (
                <div key={k.title} className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-neutral-50)] border border-[var(--color-border-default)]">
                  <div className="text-xs text-[var(--color-text-secondary)]">{k.title}</div>
                  <div className="text-2xl font-bold font-serif text-[var(--color-primary)] mt-1">{k.val}</div>
                  <div className="text-[11px] text-[var(--color-neutral-500)] mt-0.5">{k.change}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {roleDensity === 'student' && (
          <div className="space-y-4">
            <div className="border-b border-[var(--color-border-default)] pb-3">
              <span className="text-xs font-semibold px-2 py-0.5 bg-[var(--game-purple)] text-white rounded">
                Student Mode (Gamification • XP • Level • Badges)
              </span>
              <h3 className="text-xl font-serif font-bold text-[var(--color-neutral-900)] mt-1">
                Góc Học Tập & Thi Đua — Cấp 2 Hiệp Sĩ
              </h3>
            </div>

            <div className="p-5 rounded-[var(--radius-2xl)] bg-gradient-to-r from-[var(--game-purple)] to-[var(--game-blue)] text-white shadow-md space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-wider font-bold opacity-90">Hiệp Sĩ Cấp 1</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold">🔥 6 Tuần Streak</span>
              </div>
              <div className="text-2xl font-bold font-serif">Level 5 — 860 / 1000 XP</div>
              <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--game-gold)] rounded-full" style={{ width: '86%' }}></div>
              </div>
              <p className="text-xs opacity-90">Chỉ còn 140 XP nữa để mở khóa huy hiệu “Chuyên Cần Thánh Thể”!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   TAB 3: COMPLETE UI STATES (Loading, Empty, Error, Success)
   ========================================================================== */
function UIStatesSection({
  uiState,
  setUiState
}: {
  uiState: UIState;
  setUiState: (s: UIState) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] shadow-xs">
        <div>
          <h2 className="text-lg font-bold font-serif text-[var(--color-neutral-900)]">
            Kiểm Thử 4 Trạng Thái Giao Diện Bắt Buộc
          </h2>
          <p className="text-xs text-[var(--color-neutral-600)]">
            Tuân thủ ma trận trạng thái: Loading (Skeleton), Empty, Error (Retry) và Success.
          </p>
        </div>

        {/* State Toggle Buttons */}
        <div className="flex bg-[var(--color-neutral-100)] p-1 rounded-[var(--radius-md)] text-xs font-semibold">
          {[
            { id: 'loading', label: '1. Loading' },
            { id: 'empty', label: '2. Empty' },
            { id: 'error', label: '3. Error' },
            { id: 'success', label: '4. Success' },
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setUiState(st.id as UIState)}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-[var(--radius-sm)] transition-all ${
                uiState === st.id
                  ? 'bg-white text-[var(--color-primary)] font-bold shadow-xs'
                  : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Render Current State Container */}
      <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] shadow-sm min-h-[360px] flex flex-col justify-center">
        {uiState === 'loading' && (
          <div className="space-y-4 max-w-xl mx-auto w-full animate-pulse">
            <div className="flex items-center gap-2 text-xs text-[var(--color-primary)] font-semibold mb-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Đang tải danh sách học sinh theo Skeleton Loader...
            </div>
            <div className="h-7 bg-[var(--color-neutral-200)] rounded-[var(--radius-sm)] w-3/4"></div>
            <div className="h-4 bg-[var(--color-neutral-100)] rounded-[var(--radius-sm)] w-1/2"></div>
            <div className="space-y-2 mt-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 bg-[var(--color-neutral-100)] rounded-[var(--radius-md)] flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-neutral-200)]"></div>
                    <div className="space-y-1">
                      <div className="w-28 h-3.5 bg-[var(--color-neutral-200)] rounded"></div>
                      <div className="w-16 h-2.5 bg-[var(--color-neutral-200)] rounded"></div>
                    </div>
                  </div>
                  <div className="w-16 h-8 bg-[var(--color-neutral-200)] rounded"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {uiState === 'empty' && (
          <div className="text-center py-10 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-gold-50)] text-[var(--color-gold-600)] flex items-center justify-center text-3xl shadow-xs">
              🏫
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-serif font-bold text-[var(--color-neutral-900)]">
                Chưa có lớp học nào
              </h4>
              <p className="text-sm text-[var(--color-neutral-600)]">
                Vui lòng tạo lớp học đầu tiên hoặc liên hệ Ban Quản Trị để phân công danh sách học sinh.
              </p>
            </div>
            <button className="min-h-[48px] px-6 bg-[var(--color-primary)] text-white text-sm font-bold rounded-[var(--radius-md)] shadow hover:bg-[var(--color-primary-hover)] transition-colors">
              + Tạo Lớp Mới
            </button>
          </div>
        )}

        {uiState === 'error' && (
          <div className="text-center py-10 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-error-50)] text-[var(--color-error-600)] flex items-center justify-center shadow-xs">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-serif font-bold text-[var(--color-error-700)]">
                Không thể tải dữ liệu
              </h4>
              <p className="text-sm text-[var(--color-neutral-600)]">
                Đã xảy ra lỗi khi kết nối với máy chủ. Vui lòng kiểm tra đường truyền và thử lại.
              </p>
            </div>
            <button 
              onClick={() => setUiState('loading')}
              className="min-h-[48px] px-6 bg-[var(--color-primary)] text-white text-sm font-bold rounded-[var(--radius-md)] shadow hover:bg-[var(--color-primary-hover)] transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Thử lại ngay</span>
            </button>
          </div>
        )}

        {uiState === 'success' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-default)]">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
                  <h4 className="text-lg font-serif font-bold text-[var(--color-neutral-900)]">
                    Dữ liệu tải thành công: Lớp 7A (Giáo lý Giữa kỳ)
                  </h4>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  28 học sinh • 25 đã có điểm • 3 chưa nhập
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-[var(--color-success-50)] text-[var(--color-success-700)] font-semibold border border-[var(--color-success-200)]">
                Trạng thái: Sẵn sàng
              </span>
            </div>

            {/* Mock Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)] text-xs text-[var(--color-neutral-500)] bg-[var(--color-neutral-50)]">
                    <th className="py-2.5 px-3">STT</th>
                    <th className="py-2.5 px-3">Học Sinh</th>
                    <th className="py-2.5 px-3">Chuyên Cần</th>
                    <th className="py-2.5 px-3">Điểm Giữa Kỳ</th>
                    <th className="py-2.5 px-3 text-right">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-neutral-100)]">
                  <tr className="hover:bg-[var(--color-neutral-50)]">
                    <td className="py-3 px-3 font-mono text-xs">01</td>
                    <td className="py-3 px-3 font-semibold text-[var(--color-neutral-900)]">Maria Nguyễn Văn An</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-xs text-[var(--color-success-700)] font-medium">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-success)]"></span> Có mặt (100%)
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[var(--color-neutral-900)]">8.5</td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-success-50)] text-[var(--color-success-700)] font-medium">
                        Đã lưu
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[var(--color-neutral-50)]">
                    <td className="py-3 px-3 font-mono text-xs">02</td>
                    <td className="py-3 px-3 font-semibold text-[var(--color-neutral-900)]">Giuse Trần Văn Bình</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-xs text-[var(--color-warning-700)] font-medium">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-warning)]"></span> Phép (90%)
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[var(--color-neutral-900)]">7.5</td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-success-50)] text-[var(--color-success-700)] font-medium">
                        Đã lưu
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
