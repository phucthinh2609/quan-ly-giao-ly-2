import React from "react";
import {
  Bell,
  BookHeart,
  BookMarked,
  BookOpen,
  CalendarCheck,
  Church,
  Clock,
  Cross,
  Crown,
  Flame,
  Footprints,
  HandHeart,
  Heart,
  type LucideIcon,
  Medal,
  Megaphone,
  Music,
  PartyPopper,
  PencilLine,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import type { KidIconKey } from "../../services/studentPortalMockData";

/** Ánh xạ khóa icon trong mock data → icon Lucide (khu Học sinh). */
export const KID_ICONS: Record<KidIconKey, LucideIcon> = {
  "book-open": BookOpen,
  "book-marked": BookMarked,
  "book-heart": BookHeart,
  church: Church,
  cross: Cross,
  heart: Heart,
  "hand-heart": HandHeart,
  music: Music,
  sparkles: Sparkles,
  star: Star,
  flame: Flame,
  trophy: Trophy,
  medal: Medal,
  crown: Crown,
  "calendar-check": CalendarCheck,
  clock: Clock,
  footprints: Footprints,
  pencil: PencilLine,
  bell: Bell,
  megaphone: Megaphone,
  party: PartyPopper,
};

export function renderKidIcon(key: KidIconKey, className?: string): React.ReactNode {
  const Icon = KID_ICONS[key];
  return <Icon className={className} strokeWidth={2.25} aria-hidden="true" />;
}
