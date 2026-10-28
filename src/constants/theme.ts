// Core design tokens copied verbatim from ../ReactNative/src/constants/theme.ts.
export const Spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 64,
};

export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 12,
  lg: 16, // Standard card & container radius (Max 16px)
  xl: 16, // Enforced 16px maximum boundary for cards
  xxl: 16, // Enforced 16px maximum boundary
  pill: 9999,
  full: 9999,
  circle: 9999,
};

export type RadiusPreset = 'sharp' | 'compact' | 'standard' | 'smooth';

export interface RadiusPresetConfig {
  id: RadiusPreset;
  name: string;
  card: number;
  control: number;
  smControl: number;
  badge: number;
  pill: number;
  desc: string;
}

export const RadiusPresets: Record<RadiusPreset, RadiusPresetConfig> = {
  sharp: {
    id: 'sharp',
    name: 'Sắc Nét',
    card: 8,
    control: 6,
    smControl: 4,
    badge: 4,
    pill: 6,
    desc: 'Dứt khoát, góc nhọn sắc sảo (6px)',
  },
  compact: {
    id: 'compact',
    name: 'Gọn Gàng',
    card: 12,
    control: 8,
    smControl: 6,
    badge: 6,
    pill: 10,
    desc: 'Hiện đại, tiết kiệm diện tích (8px)',
  },
  standard: {
    id: 'standard',
    name: 'Chuẩn Mực',
    card: 16,
    control: 12,
    smControl: 8,
    badge: 8,
    pill: 14,
    desc: 'Bo góc chuẩn Apple iOS (12px), Card 16px',
  },
  smooth: {
    id: 'smooth',
    name: 'Mềm Mại (Pill)',
    card: 16,
    control: 9999,
    smControl: 9999,
    badge: 9999,
    pill: 9999,
    desc: 'Nút dạng viên thuốc toàn phần (Pill), Card 16px',
  },
};

export type ControlSizeKey = 'sm' | 'md' | 'lg';

export interface ControlSizeMetric {
  height: number;
  iconSize: number;
  paddingHorizontal: number;
  fontSize: number;
  lineHeight: number;
  gap: number;
}

/**
 * Global Control & Component Sizing Scale (in px)
 * Ensures 100% size parity across Buttons, Inputs, Selects, SearchBars and form controls.
 * - sm: 36px (compact lists, dense tables, toolbar actions)
 * - md: 44px (Apple iOS standard 44pt touch target - default)
 * - lg: 52px (hero actions, prominent checkout/login forms)
 */
export const ControlSize: Record<ControlSizeKey, ControlSizeMetric> & {
  iconBtnSm: number;
  iconBtnMd: number;
  badgeHeightSm: number;
  badgeHeightMd: number;
} = {
  sm: {
    height: 36,
    iconSize: 16,
    paddingHorizontal: 12,
    fontSize: 13,
    lineHeight: 18,
    gap: 6,
  },
  md: {
    height: 44, // Apple 44pt touch target standard
    iconSize: 18,
    paddingHorizontal: 16,
    fontSize: 15,
    lineHeight: 20,
    gap: 8,
  },
  lg: {
    height: 52,
    iconSize: 20,
    paddingHorizontal: 20,
    fontSize: 17,
    lineHeight: 22,
    gap: 10,
  },
  iconBtnSm: 36,
  iconBtnMd: 44,
  badgeHeightSm: 24,
  badgeHeightMd: 28,
};

/**
 * Returns standardized sizing metrics for any control element.
 */
export const getControlMetric = (
  size: ControlSizeKey = 'md',
): ControlSizeMetric => {
  return ControlSize[size] ?? ControlSize.md;
};

export const Typography = {
  display: {
    fontSize: 34,
    fontWeight: '800' as const,
    lineHeight: 42,
  },
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  header: {
    fontSize: 26,
    fontWeight: '700' as const,
    lineHeight: 34,
  },
  title: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 22,
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  body2: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  overline: {
    fontSize: 10,
    fontWeight: '700' as const,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
};

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 10,
  },
};

export const Motion = {
  pressScale: 0.975,
  quick: 160,
  enter: 240,
  toastDuration: 2800,
};
// Choose the base's smooth preset once; cards keep their original 16px radius.
export const AppRadii = RadiusPresets.smooth;
export const FloatingChrome = {
  backgroundColor: 'rgba(255, 255, 255, 0.96)',
  borderColor: 'rgba(0, 0, 0, 0.08)',
  borderWidth: 1,
  borderRadius: BorderRadius.pill,
  boxShadow: '0px 6px 16px rgba(15, 23, 42, 0.10)',
} as const;
export const Gradients = {
  minimal:
    'radial-gradient(ellipse at 95% 0%, rgba(153, 198, 241, 0.20) 0%, rgba(153, 198, 241, 0) 65%), radial-gradient(ellipse at 0% 80%, rgba(196, 187, 231, 0.14) 0%, rgba(196, 187, 231, 0) 60%), linear-gradient(160deg, #F1F5F9 0%, #F8FAFC 55%, #FFFFFF 100%)',
  glass:
    'linear-gradient(150deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.62) 100%)',
  primary: 'linear-gradient(145deg, #06B6D4 0%, #0891B2 55%, #0E7490 100%)',
  hero: 'linear-gradient(125deg, rgba(255, 255, 255, 0.97) 0%, rgba(236, 254, 255, 0.90) 62%, rgba(239, 246, 255, 0.84) 100%)',
};
