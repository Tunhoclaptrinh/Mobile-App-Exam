/**
 * Apple iOS 18 Cupertino Design System & Liquid Glass Tokens
 * Định nghĩa bảng màu System Colors, hiệu ứng Frosted Glassmorphism,
 * viền phản quang và độ cong liên tục (Apple Squircles) đặc trưng của Apple.
 */

export const AppleColors = {
  // Apple Dynamic System Colors
  systemBlue: '#007AFF',
  systemPurple: '#AF52DE',
  systemIndigo: '#5856D6',
  systemTeal: '#30B0C7',
  systemMint: '#00C7BE',
  systemGreen: '#34C759',
  systemYellow: '#FFCC00',
  systemOrange: '#FF9500',
  systemPink: '#FF2D55',
  systemRed: '#FF3B30',

  // Liquid Glass Backgrounds
  glassLight: 'rgba(255, 255, 255, 0.72)',
  glassDark: 'rgba(30, 30, 35, 0.75)',

  // Specular Reflection Highlight Borders
  glassBorderLight: 'rgba(255, 255, 255, 0.65)',
  glassBorderDark: 'rgba(255, 255, 255, 0.14)',

  // Liquid Glass Cards Subtle Gradient Accents
  glassAccentLight: 'rgba(0, 122, 255, 0.08)',
  glassAccentDark: 'rgba(0, 122, 255, 0.15)',
} as const;

export const AppleGlassTokens = {
  blurIntensity: 25,
  borderRadius: 16, // Standardized 16px maximum boundary
  borderWidth: 1.2,
  surface: {
    light: 'rgba(255, 255, 255, 0.60)',
    dark: 'rgba(24, 27, 38, 0.65)',
    subtleLight: 'rgba(255, 255, 255, 0.40)',
    subtleDark: 'rgba(20, 23, 33, 0.50)',
  },
  border: {
    light: 'rgba(255, 255, 255, 0.80)',
    dark: 'rgba(255, 255, 255, 0.22)',
    subtleLight: 'rgba(255, 255, 255, 0.50)',
    subtleDark: 'rgba(255, 255, 255, 0.12)',
  },
  highlight: {
    light: 'rgba(255, 255, 255, 0.95)',
    dark: 'rgba(255, 255, 255, 0.40)',
  },
  shadows: {
    light: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 0,
    },
    dark: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 0,
    },
  },
} as const;
