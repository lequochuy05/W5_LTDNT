export const Colors = {
  // Primary palette
  primary: '#1A3A6B',
  primaryLight: '#2A5298',
  primaryDark: '#0F2340',
  accent: '#4F8EF7',
  accentLight: '#7BAAFF',

  // Status
  success: '#2ECC71',
  successLight: '#D5F5E3',
  successDark: '#1A8B4A',
  error: '#E74C3C',
  errorLight: '#FADBD8',
  warning: '#F39C12',
  warningLight: '#FEF9E7',

  // Neutrals
  white: '#FFFFFF',
  background: '#F4F6FB',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF2FA',
  border: '#DDE3F0',
  borderLight: '#F0F3FA',

  // Text
  textPrimary: '#1A2B4A',
  textSecondary: '#5A6A85',
  textTertiary: '#8FA3BF',
  textInverse: '#FFFFFF',

  // Tab bar
  tabBar: '#FFFFFF',
  tabBarBorder: '#E8EDF5',
  tabActive: '#2A5298',
  tabInactive: '#A0AFC5',

  // Room type badges
  badgeLab: '#EEF4FF',
  badgeLabText: '#2A5298',
  badgeStudy: '#F0FAF0',
  badgeStudyText: '#2D7A4F',
  badgeLibrary: '#FFF8EE',
  badgeLibraryText: '#B07000',

  // Slot states
  slotAvailable: '#EEF8F2',
  slotAvailableBorder: '#2ECC71',
  slotOccupied: '#FDF0EF',
  slotOccupiedBorder: '#E74C3C',
  slotSelected: '#2A5298',
  slotSelectedText: '#FFFFFF',

  // Overlay
  overlay: 'rgba(10, 20, 40, 0.5)',
  shimmer: '#E8EDF5',
} as const;

export type ColorKey = keyof typeof Colors;
