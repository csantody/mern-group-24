// Colors taken from the Accelly Figma file (dark mode).

export const colors = {
  white: '#FFFFFF',
  primary: '#0E6BA8', // "Cornflower Ocean": buttons, links, logo background
  accent: '#A6E1FA', // "Frosted Blue": active nav, back links, chart

  // Login / Register screens
  auth: {
    bg: '#0B1B3A',
    card: '#0F1E3D',
    border: '#1E3A5F',
    muted: '#AFC2E0',
  },

  // Signed-in app screens
  app: {
    bg: '#08234D',
    border: '#2C4C76',
    surface: '#0C2A5A', // cards and rows
    surfaceRaised: '#102F5D', // inputs and secondary buttons
    avatar: '#123D68',
    badge: '#0E3563',
    chartBg: '#001C55', // "Deep Navy"
    statCard: '#0E2B54',
    statBorder: '#29476E',
    textMuted: '#BDD1E8',
    textSoft: '#D5E5F3',
  },
};

// Inter font families, loaded in src/app/_layout.tsx.
// On Android a custom font needs its own family for each weight; fontWeight alone won't switch it.

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
};
