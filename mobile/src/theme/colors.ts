// Ported token-for-token from Carlib/DesignSystem/CarlibColors.swift.
// The Swift `*Blue` legacy names are renamed to what views actually alias
// (brandYellow etc.). Every token has a light and dark value — dark mode is a
// shipping feature (Settings theme picker), not scaffolding.

export interface StatusColor {
  fg: string;
  bg: string;
}

export interface ColorTokens {
  brandYellow: string;
  brandYellowDark: string;
  brandYellowLight: string;
  /** Primary text ("carlibDark" / brandCharcoal in Swift). */
  carlibDark: string;
  carlibSecondary: string;
  carlibLabel: string;
  carlibScreenBg: string;
  carlibCardBorder: string;
  carlibAccent: string;
  carlibTabInactive: string;
  tilePrimary: string;
  tileSecondary: string;
  destructiveRed: string;
  destructiveRedBg: string;
  status: {
    draft: StatusColor;
    submitted: StatusColor;
    matched: StatusColor;
    accepted: StatusColor;
    inProgress: StatusColor;
    repairing: StatusColor;
    completed: StatusColor;
    cancelled: StatusColor;
    expired: StatusColor;
  };
}

export const lightColors: ColorTokens = {
  brandYellow: '#F5B700',
  brandYellowDark: '#CC9900',
  brandYellowLight: '#FFF2D9',
  carlibDark: '#000000',
  carlibSecondary: '#666B73',
  carlibLabel: '#8C9199',
  carlibScreenBg: '#FFFFFF',
  carlibCardBorder: '#E8E8EB',
  carlibAccent: '#F5F5F7',
  carlibTabInactive: '#8C9199',
  tilePrimary: '#F5B700',
  tileSecondary: '#F1F1F4',
  destructiveRed: '#E64D4D',
  destructiveRedBg: '#FFEDED',
  status: {
    draft: { fg: '#99999E', bg: '#F0F0F2' },
    submitted: { fg: '#6194F2', bg: '#EBF2FF' },
    matched: { fg: '#F2B333', bg: '#FFF5E0' },
    accepted: { fg: '#40BFB3', bg: '#E6FAF7' },
    inProgress: { fg: '#668FEB', bg: '#EBF2FF' },
    repairing: { fg: '#F2A626', bg: '#FFF5E6' },
    completed: { fg: '#4DC76B', bg: '#EBFAED' },
    cancelled: { fg: '#E65959', bg: '#FFEDED' },
    expired: { fg: '#8C8C91', bg: '#F0F0F2' },
  },
};

export const darkColors: ColorTokens = {
  brandYellow: '#F5B700',
  brandYellowDark: '#CC9900',
  brandYellowLight: '#332600',
  carlibDark: '#FFFFFF',
  carlibSecondary: '#9CA3AF',
  carlibLabel: '#6B7280',
  carlibScreenBg: '#0F0F0F',
  carlibCardBorder: '#2A2A2A',
  carlibAccent: '#1E1E1E',
  carlibTabInactive: '#6B7280',
  tilePrimary: '#F5B700',
  tileSecondary: '#1E1E1E',
  destructiveRed: '#E64D4D',
  destructiveRedBg: '#2E0F0F',
  status: {
    draft: { fg: '#99999E', bg: '#262629' },
    submitted: { fg: '#6194F2', bg: '#0F1A2E' },
    matched: { fg: '#F2B333', bg: '#2E210A' },
    accepted: { fg: '#40BFB3', bg: '#0A2624' },
    inProgress: { fg: '#668FEB', bg: '#0F1A2E' },
    repairing: { fg: '#F2A626', bg: '#2E1F08' },
    completed: { fg: '#4DC76B', bg: '#0A290F' },
    cancelled: { fg: '#E65959', bg: '#2E0F0F' },
    expired: { fg: '#8C8C91', bg: '#242426' },
  },
};
