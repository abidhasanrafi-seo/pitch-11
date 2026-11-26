export type GameMode = 'MATCH' | 'PENALTY_SHOOTOUT';

export type ScreenState =
  | 'TITLE'
  | 'PLAYING'
  | 'PAUSED'
  | 'HALFTIME'
  | 'FULLTIME';

export type TeamSide = 'HOME' | 'AWAY';

export type PlayerRole = 'GK' | 'DEF' | 'MID' | 'FWD';

export type FormationId = '4-3-3' | '4-4-2' | '3-5-2';

export type Difficulty = 'AMATEUR' | 'PRO' | 'WORLD_CLASS';

export interface Player {
  id: string;
  team: TeamSide;
  number: number;
  role: PlayerRole;
  baseNx: number;
  baseNy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: number;
  stamina: number;
  stridePhase: number;
  isSprinting: boolean;
  tackleTimer: number;
  tackleCooldown: number;
  stunTimer: number;
  kickAnimTimer: number;
  diveTimer: number;
  diveDirY: number;
  aiDecisionTimer: number;
}

export interface Ball {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  spin: number;
  rotation: number;
  ownerId: string | null;
  lastTouchTeam: TeamSide | null;
  lastTouchPlayerId: string | null;
  pickupCooldown: number;
}

export interface Particle {
  active: boolean;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
  kind: 'turf' | 'chalk' | 'confetti' | 'spark';
}

export type KickOutcome = 'GOAL' | 'MISS' | 'SAVE' | null;

export type PenaltyPhase =
  | 'AIMING'
  | 'CHARGING'
  | 'RUNUP'
  | 'FLIGHT'
  | 'KEEPER_WAIT'
  | 'KEEPER_FLIGHT'
  | 'RESULT'
  | 'FINISHED';

export interface PenaltyState {
  phase: PenaltyPhase;
  turn: TeamSide;
  round: number;
  suddenDeath: boolean;
  homeKicks: KickOutcome[];
  awayKicks: KickOutcome[];
  homeScore: number;
  awayScore: number;
  winner: TeamSide | null;
  aimX: number;
  aimY: number;
  power: number;
  powerDir: number;
  keeperTargetX: number;
  keeperTargetY: number;
  keeperCurrX: number;
  keeperCurrY: number;
  keeperDiveCommitted: boolean;
  aiWaitTimer: number;
  aiWaitDuration: number;
  aiCueX: number;
  kickerProgress: number;
  ballProgress: number;
  shotStartX: number;
  shotStartY: number;
  shotEndX: number;
  shotEndY: number;
  shotCurve: number;
  shotPeakZ: number;
  ballCurrX: number;
  ballCurrY: number;
  ballCurrZ: number;
  ballTrail: Array<{ x: number; y: number; z: number }>;
  netRippleX: number;
  netRippleY: number;
  netRippleStrength: number;
  resultTimer: number;
  resultBanner: string;
  resultSub: string;
}

export interface MatchStats {
  homeShots: number;
  awayShots: number;
  homeOnTarget: number;
  awayOnTarget: number;
  homePossessionTicks: number;
  awayPossessionTicks: number;
  homeSaves: number;
  awaySaves: number;
}

export interface HudSnapshot {
  screen: ScreenState;
  mode: GameMode;
  homeScore: number;
  awayScore: number;
  half: 1 | 2;
  clockSeconds: number;
  halfDurationSeconds: number;
  activePlayerNumber: number;
  activePlayerRole: PlayerRole;
  activePlayerStamina: number;
  shotCharge: number;
  goalBannerText: string | null;
  goalBannerSub: string | null;
  stats: MatchStats;
  cards: { homeY: number; awayY: number; homeR: number; awayR: number };
  penalty: {
    phase: PenaltyPhase;
    turn: TeamSide;
    round: number;
    suddenDeath: boolean;
    homeScore: number;
    awayScore: number;
    homeKicks: KickOutcome[];
    awayKicks: KickOutcome[];
    winner: TeamSide | null;
    resultBanner: string;
    resultSub: string;
    power: number;
    keeperCommitted: boolean;
  };
}

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  analogX: number;
  analogY: number;
  sprint: boolean;
  shootHeld: boolean;
  shootJustPressed: boolean;
  shootJustReleased: boolean;
  passJustPressed: boolean;
  throughJustPressed: boolean;
  mouseNormX: number;
  mouseNormY: number;
  mouseActive: boolean;
  mouseDown: boolean;
  mouseJustPressed: boolean;
  mouseJustReleased: boolean;
}
