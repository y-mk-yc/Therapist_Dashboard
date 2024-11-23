// 代表疲劳记录的类型
export type FatigueRecord = {
  t: number;
  value: number;
};

// 代表动作补偿记录的类型
export type MovementCompensationRecord = {
  t: number;
  types: number[];
};

// 代表动作记录的类型
export type MovementRecord = {
  t: number;
  SFE: number;
  SHFE: number;
  SIE: number;
  EFE: number;
  RE: number;
  A_trunk_Z: number;
  A_trunk_Y: number;
  A_trunk_X: number;
  G_trunk_Z: number;
  G_trunk_Y: number;
  G_trunk_X: number;
  M_trunk_Z: number;
  M_trunk_Y: number;
  M_trunk_X: number;
  A_arm_Z: number;
  A_arm_Y: number;
  A_arm_X: number;
  G_arm_Z: number;
  G_arm_Y: number;
  G_arm_X: number;
  M_arm_Z: number;
  M_arm_Y: number;
  M_arm_X: number;
};

// 治疗焦点的类型
export type TherapyFocus = {
  ROM: boolean;
  Strength: boolean;
  Endurance: boolean;
  ShoulderAA: boolean;
  ShoulderFE: boolean;
  ShoulderIE: boolean;
  ElbowFE: boolean;
  WristPS: boolean;
  Index: boolean;
  Grasp: boolean;
};

// 完整的会话数据类型
export type SessionData = {
  SessionID: string;
  ProtocolName: string;
  ProtocolDescription: string;
  TherapyFocus: TherapyFocus;
  Thumbnail: string;
  Status: string;
  Date: string;
  Duration: number;
  Score: number;
  HighScore: number;
  Rating: string;
  OverallRating: number;
  Movements: MovementRecord[];//存储每一帧的原始数据
  Fatigue: FatigueRecord[];
  MovementCompensation: MovementCompensationRecord[];
};
