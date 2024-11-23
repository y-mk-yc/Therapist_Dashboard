import { compensationType } from "../Labeling/TestData/LabelingDataStructure";



// 代表疲劳记录的类型
export type FatigueRecord = {
  t: number;
  value: number;
};

// 代表动作补偿记录的类型
// export type MovementCompensationRecord = {
//   t: number;
//   types: number[];
// };

// export type LabelType = "Prediction" | "Manual";


// 根据Type区分不同的数据来源
// export interface CompensationRecord {
//   t_start: number;
//   t_end: number;
// }


// Type 为 Manual 的数据结构
export type ManualCompensationRecord = {
  t_start: number;
  t_end: number;
  Type: "Manual";// 总标签：Prediction 或 Manual
  Label: Array<compensationType>;// 具体标签： 具体的所有类型
  ModificationInfo: {
    TherapistID: string;
    Date: number;
    Comment: string;
  }
};

// Type 为 Prediction 的数据结构
export type PredictionCompensationRecord = {
  t_start: number;
  t_end: number;
  Type: "Prediction";// 总标签：Prediction 或 Manual
  Label: Array<compensationType>;// 具体标签： 具体的所有类型
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
export type NewSessionData = {
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
  // MovementCompensation: MovementCompensationRecord[];
  Compensation: Array<ManualCompensationRecord | PredictionCompensationRecord>;
};
