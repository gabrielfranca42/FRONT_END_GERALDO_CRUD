// Paleta de cores premium para o app
export const COLORS = {
  // Primárias
  primary: '#6C63FF',
  primaryDark: '#5A52D5',
  primaryLight: '#8B85FF',
  primarySoft: '#EAE8FF',

  // Acentuação
  accent: '#FF6B6B',
  accentDark: '#E85555',
  accentLight: '#FF8A8A',

  // Sucesso / Lido
  success: '#2ED573',
  successDark: '#20BF6B',
  successSoft: '#E8FFF1',

  // Alerta
  warning: '#FFA502',
  warningDark: '#E69500',
  warningSoft: '#FFF8E8',

  // Fundos
  background: '#0F0F1A',
  surface: '#1A1A2E',
  surfaceLight: '#242442',
  card: '#16213E',

  // Textos
  text: '#FFFFFF',
  textSecondary: '#A0A0C0',
  textMuted: '#6C6C8A',

  // Utilitários
  border: '#2A2A4A',
  divider: '#252545',
  overlay: 'rgba(0, 0, 0, 0.6)',
  white: '#FFFFFF',
  black: '#000000',
  danger: '#FF4757',
  dangerSoft: '#FFE8EA',
};

export const FONTS = {
  regular: 16,
  small: 14,
  xsmall: 12,
  large: 18,
  xlarge: 22,
  title: 28,
  hero: 34,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
};

// Mapeamento de cores por gênero para os badges
export const GENRE_COLORS = {
  'Ficção': '#6C63FF',
  'Não-Ficção': '#FF6B6B',
  'Romance': '#FF85A2',
  'Terror': '#8B0000',
  'Fantasia': '#9B59B6',
  'Ficção Científica': '#00D2FF',
  'Biografia': '#FFA502',
  'História': '#C49B63',
  'Autoajuda': '#2ED573',
  'Técnico': '#45AAF2',
  'Infantil': '#FFD93D',
  'Outro': '#A0A0C0',
};
