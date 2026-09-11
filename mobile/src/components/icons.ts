// Port of CarlibIcon (Carlib/DesignSystem/LucideIcon.swift): the semantic icon
// registry. Use RemixIcon directly for one-off glyphs, CarlibIcon for roles
// that may change glyph over time.
import type { RemixIconName } from './RemixIcon';

export const CarlibIcon = {
  // Tab bar
  home: 'homeLine',
  shops: 'mapPinLine',
  profile: 'userLine',
  dashboard: 'dashboardLine',
  claims: 'fileListLine',
  planning: 'calendarLine',
  shop: 'store2Line',

  // Actions
  report: 'addLine',
  add: 'addLine',
  addCircle: 'addCircleLine',
  close: 'closeLine',
  check: 'checkLine',
  search: 'searchLine',
  edit: 'editLine',

  // Navigation chevrons
  chevronRight: 'arrowRightSLine',
  chevronDown: 'arrowDownSLine',
  chevronUp: 'arrowUpSLine',
  chevronLeft: 'arrowLeftSLine',
  arrowRight: 'arrowRightLine',
  arrowLeft: 'arrowLeftLine',

  // Contact & location
  mapPin: 'mapPinLine',
  mapPinFilled: 'mapPinFill',
  phone: 'phoneLine',
  phoneFilled: 'phoneFill',

  // Vehicle
  car: 'carLine',
  carFilled: 'carFill',
  carFront: 'carLine',

  // Claim & status
  triangleAlert: 'errorWarningLine',
  send: 'sendPlaneLine',
  sendFilled: 'sendPlaneFill',
  wrench: 'toolsLine',
  wrenchFilled: 'toolsFill',
  checkCircle: 'checkboxCircleLine',
  checkCircleFilled: 'checkboxCircleFill',
  closeCircleFilled: 'closeCircleFill',
  shieldCheck: 'shieldCheckFill',
  thumbUp: 'thumbUpFill',
  verified: 'verifiedBadgeFill',
  archiveBox: 'archiveFill',
  stethoscope: 'stethoscopeLine',

  // Time
  calendar: 'calendarLine',
  calendarCheck: 'calendarCheckFill',
  calendarSchedule: 'calendarScheduleLine',
  clock: 'timeLine',
  clockFilled: 'timeFill',
  history: 'historyLine',

  // Content
  photo: 'imageLine',
  photoFilled: 'imageFill',
  camera: 'cameraFill',
  file: 'fileTextLine',
  inbox: 'inboxLine',
  pencil: 'pencilLine',

  // Profile & settings
  bell: 'notificationLine',
  globe: 'globalLine',
  contrast: 'contrastFill',
  info: 'informationLine',
  lock: 'shieldKeyholeLine',
  logout: 'logoutBoxLine',
  building: 'storeLine',
  buildingFilled: 'storeFill',
  star: 'starFill',
  eye: 'eyeLine',
  eyeOff: 'eyeOffLine',
} as const satisfies Record<string, RemixIconName>;

export type CarlibIconName = keyof typeof CarlibIcon;
