import { LabelType } from "../TypeColors";
import { compensationType, options, FrameData, Frame, Details, LabeledZone } from "./LabelingDataStructure";

// type compensationType = "Unable to determine" | "Healthy" |
//   "Torso flexion" | "Torso tilt" | "Torso rotation" | "Elevation plane" |
//   "Elevation angle" | "Shoulder rotation" | "Elbow flexion" | "Forearm rotation" |
//   "Wrist deviation" | "Wrist flexion" | "Other reason (Compensation)";

// const options = [
//   "Unable to determine", "Healthy",
//   "Torso flexion", "Torso tilt", "Torso rotation", "Elevation plane",
//   "Elevation angle", "Shoulder rotation", "Elbow flexion", "Forearm rotation",
//   "Wrist deviation", "Wrist flexion", "Other reason (Compensation)"
// ];


// type JointData = {
//   x: number;
//   y: number;
//   z: number;
// }

// export type Frame = {
//   frameNumber: number;
//   data: {
//     time: number;
//     pelvis_tilt: number;
//     pelvis_list: number;
//     pelvis_rotation: number;
//     pelvis_tx: number;
//     pelvis_ty: number;
//     pelvis_tz: number;
//     back_tilt: number;
//     back_list: number;
//     back_rotation: number;
//     clv_rot_l: number;
//     clv_lift_l: number;
//     shoulder_add_l: number;
//     shoulder_rot_l: number;
//     shoulder_flex_l: number;
//     elbow_flexion_l: number;
//     pro_sup_l: number;
//     wrist_flex_l: number;
//     wrist_dev_l: number;
//   };
//   labelId: string[];
// }

// export type Details = {
//   startFrame: number;
//   endFrame: number;
//   detailedType: Array<compensationType>;
//   comment: string;
// }

// export type LabeledZone = {
//   id: string;
//   type: LabelType;
//   therapistID: string;
//   therapistName: string;
//   date: string;
//   details: Details;
// }

export const exampleLabel: LabeledZone[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    type: "Compensatory_Manually",
    therapistID: "the-2",
    therapistName: "Jane Smith",
    date: "2024-04-07",
    details: {
      startFrame: 1,
      endFrame: 1,
      detailedType: ["Shoulder rotation"],
      comment: "aaa aaa",
    }
  },
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    type: "Compensatory_Manually",
    therapistID: "the-2",
    therapistName: "Jane Smith",
    date: "2024-04-08",
    details: {
      startFrame: 2,
      endFrame: 3,
      detailedType: ["Shoulder rotation"],
      comment: "bbb bbb",
    }
  },
  {
    id: "3dfc6e9e-23ab-4c0a-84b5-7f4a0d3834e5",
    type: "Compensatory_Manually",
    therapistID: "the-1",
    therapistName: "John Doe",
    date: "2024-04-08",
    details: {
      startFrame: 2,
      endFrame: 4,
      detailedType: ["Shoulder rotation", "Elbow flexion", "Wrist flexion"],
      comment: "ccc ccc",
    }
  },
  {
    id: "7d8c0dbf-eedb-4ae3-aa6e-2b91af016795",
    type: "Compensatory_Manually",
    therapistID: "the-1",
    therapistName: "John Doe",
    date: "2024-04-09",
    details: {
      startFrame: 4,
      endFrame: 5,
      detailedType: ["Elbow flexion"],
      comment: "ddd ddd",
    }
  },
  {
    id: "7d8c0dbf-eedb-4ae3-aa6e-2b91af111111",
    type: "Compensatory_Manually",
    therapistID: "the-1",
    therapistName: "John Doe",
    date: "2024-04-10",
    details: {
      startFrame: 7,
      endFrame: 8,
      detailedType: ["Elbow flexion"],
      comment: "eee eee",
    }
  },
  {
    id: "test",
    type: "Compensatory_SystemDetected",
    therapistID: "",
    therapistName: "SystemDetected",
    date: "2024-05-20",
    details: {
      startFrame: 7,
      endFrame: 9,
      detailedType: ["Shoulder rotation", "Elbow flexion"],
      comment: "",
    }
  }
]

//TODO:这里下面的exampleData没有用到，先把它注释掉
/*export const exampleData: Frame[] = [
  {
    frameNumber: 0,
    data: {
      time: 0.01000000,
      pelvis_tilt: 1.84226187,
      pelvis_list: -17.80174459,
      pelvis_rotation: 82.47626238,
      pelvis_tx: 0.14564627,
      pelvis_ty: 1.29278402,
      pelvis_tz: -0.18734884,
      back_tilt: -0.94850254,
      back_list: 14.77102318,
      back_rotation: 18.45794615,
      clv_rot_l: -5.66067786,
      clv_lift_l: 15.27943222,
      shoulder_add_l: 29.42704216,
      shoulder_rot_l: -50.87552081,
      shoulder_flex_l: 1.81518996,
      elbow_flexion_l: 7.53255692,
      pro_sup_l: -5.13262262,
      wrist_flex_l: 0.00000000,
      wrist_dev_l: 0.00000012,
    },
    labelId: [""],
  },
  {
    frameNumber: 1,
    data: {
      time: 0.02000000,
      pelvis_tilt: 1.02972291,
      pelvis_list: -23.29809239,
      pelvis_rotation: 82.47700087,
      pelvis_tx: 0.14465860,
      pelvis_ty: 1.29066329,
      pelvis_tz: -0.18051061,
      back_tilt: -2.42312363,
      back_list: 13.93917167,
      back_rotation: 25.76452577,
      clv_rot_l: -6.26974006,
      clv_lift_l: 17.22566561,
      shoulder_add_l: 29.91180007,
      shoulder_rot_l: -48.66623418,
      shoulder_flex_l: -0.63744425,
      elbow_flexion_l: 7.80581828,
      pro_sup_l: -2.79385951,
      wrist_flex_l: 0.00000000,
      wrist_dev_l: 0.00000012,
    },
    labelId: ["550e8400-e29b-41d4-a716-446655440000"],
  },
  {
    frameNumber: 2,
    data: {
      time: 0.03000000,
      pelvis_tilt: 1.02981839,
      pelvis_list: -23.29734589,
      pelvis_rotation: 82.47649314,
      pelvis_tx: 0.14465096,
      pelvis_ty: 1.29066000,
      pelvis_tz: -0.18047653,
      back_tilt: -2.42302118,
      back_list: 13.93868274,
      back_rotation: 25.76509020,
      clv_rot_l: -6.27005462,
      clv_lift_l: 17.22591848,
      shoulder_add_l: 29.91157171,
      shoulder_rot_l: -48.66629267,
      shoulder_flex_l: -0.63696679,
      elbow_flexion_l: 7.80577194,
      pro_sup_l: -2.79386023,
      wrist_flex_l: 0.00000000,
      wrist_dev_l: 0.00000012,
    },
    labelId: ["f47ac10b-58cc-4372-a567-0e02b2c3d479", "3dfc6e9e-23ab-4c0a-84b5-7f4a0d3834e5"],
  },
  {
    frameNumber: 3,
    data: {
      time: 0.04000000,
      pelvis_tilt: 1.02402776,
      pelvis_list: -23.29420625,
      pelvis_rotation: 82.46832942,
      pelvis_tx: 0.14458711,
      pelvis_ty: 1.29063255,
      pelvis_tz: -0.18038245,
      back_tilt: -2.41572084,
      back_list: 13.93073854,
      back_rotation: 25.76981096,
      clv_rot_l: -6.27909943,
      clv_lift_l: 17.22562862,
      shoulder_add_l: 29.91042747,
      shoulder_rot_l: -48.66564668,
      shoulder_flex_l: -0.62910536,
      elbow_flexion_l: 7.80480987,
      pro_sup_l: -2.79423568,
      wrist_flex_l: 0.00000000,
      wrist_dev_l: 0.00000012,
    },
    labelId: ["f47ac10b-58cc-4372-a567-0e02b2c3d479", "3dfc6e9e-23ab-4c0a-84b5-7f4a0d3834e5"],
  },
  {
    frameNumber: 4,
    data: {
      time: 0.05000000,
      pelvis_tilt: 1.02338357,
      pelvis_list: -23.29422583,
      pelvis_rotation: 82.46766422,
      pelvis_tx: 0.14457340,
      pelvis_ty: 1.29065292,
      pelvis_tz: -0.18036767,
      back_tilt: -2.41508001,
      back_list: 13.93012958,
      back_rotation: 25.76998943,
      clv_rot_l: -6.27980683,
      clv_lift_l: 17.22542630,
      shoulder_add_l: 29.91038358,
      shoulder_rot_l: -48.66552039,
      shoulder_flex_l: -0.62857220,
      elbow_flexion_l: 7.80467780,
      pro_sup_l: -2.79425330,
      wrist_flex_l: 0.00000000,
      wrist_dev_l: 0.00000012,
    },
    labelId: ["3dfc6e9e-23ab-4c0a-84b5-7f4a0d3834e5", "7d8c0dbf-eedb-4ae3-aa6e-2b91af016795"],
  },
  {
    frameNumber: 5,
    data: {
      time: 0.06000000,
      pelvis_tilt: 1.00578405,
      pelvis_list: -23.29654397,
      pelvis_rotation: 82.45518196,
      pelvis_tx: 0.14449660,
      pelvis_ty: 1.29050805,
      pelvis_tz: -0.18017033,
      back_tilt: -2.40217729,
      back_list: 13.91715164,
      back_rotation: 25.77085257,
      clv_rot_l: -6.29600197,
      clv_lift_l: 17.22657231,
      shoulder_add_l: 29.90777397,
      shoulder_rot_l: -48.66300059,
      shoulder_flex_l: -0.61710490,
      elbow_flexion_l: 7.80142611,
      pro_sup_l: -2.79427094,
      wrist_flex_l: 0.00000000,
      wrist_dev_l: 0.00000012,
    },
    labelId: ["7d8c0dbf-eedb-4ae3-aa6e-2b91af016795"],
  },
  {
    frameNumber: 6,
    data: {
      time: 0.07000000,
      pelvis_tilt: 1.00539862,
      pelvis_list: -23.29815786,
      pelvis_rotation: 82.45399424,
      pelvis_tx: 0.14441305,
      pelvis_ty: 1.29054267,
      pelvis_tz: -0.18017199,
      back_tilt: -2.40210350,
      back_list: 13.91650993,
      back_rotation: 25.76973541,
      clv_rot_l: -6.29654927,
      clv_lift_l: 17.22546157,
      shoulder_add_l: 29.90849137,
      shoulder_rot_l: -48.66240983,
      shoulder_flex_l: -0.61741160,
      elbow_flexion_l: 7.80086281,
      pro_sup_l: -2.79434977,
      wrist_flex_l: 0.00000000,
      wrist_dev_l: 0.00000012,
    },
    labelId: [""],
  },
  {
    frameNumber: 7,
    data: {
      time: 0.08000000,
      pelvis_tilt: 1.00499353,
      pelvis_list: -23.29815654,
      pelvis_rotation: 82.45286779,
      pelvis_tx: 0.14437530,
      pelvis_ty: 1.29052515,
      pelvis_tz: -0.18016192,
      back_tilt: -2.40180024,
      back_list: 13.91556802,
      back_rotation: 25.76982868,
      clv_rot_l: -6.29731219,
      clv_lift_l: 17.22540513,
      shoulder_add_l: 29.90831243,
      shoulder_rot_l: -48.66218245,
      shoulder_flex_l: -0.61680494,
      elbow_flexion_l: 7.80079402,
      pro_sup_l: -2.79434601,
      wrist_flex_l: 0.00000000,
      wrist_dev_l: 0.00000012,
    },
    labelId: ["7d8c0dbf-eedb-4ae3-aa6e-2b91af111111", "test"],
  },
  {
    frameNumber: 8,
    data: {
      time: 0.09000000,
      pelvis_tilt: 0.94635342,
      pelvis_list: -23.32541931,
      pelvis_rotation: 82.43829293,
      pelvis_tx: 0.14395062,
      pelvis_ty: 1.29026330,
      pelvis_tz: -0.17976524,
      back_tilt: -2.38324796,
      back_list: 13.90179202,
      back_rotation: 25.75279902,
      clv_rot_l: -6.32118666,
      clv_lift_l: 17.23004896,
      shoulder_add_l: 29.89581506,
      shoulder_rot_l: -48.65130472,
      shoulder_flex_l: -0.59642590,
      elbow_flexion_l: 7.79383471,
      pro_sup_l: -2.79336048,
      wrist_flex_l: 0.00000000,
      wrist_dev_l: 0.00000012,
    },
    labelId: ["7d8c0dbf-eedb-4ae3-aa6e-2b91af111111", "test"],
  },
  {
    frameNumber: 9,
    data: {
      time: 0.09000000,
      pelvis_tilt: 0.94635342,
      pelvis_list: -23.32541931,
      pelvis_rotation: 82.43829293,
      pelvis_tx: 0.14395062,
      pelvis_ty: 1.29026330,
      pelvis_tz: -0.17976524,
      back_tilt: -2.38324796,
      back_list: 13.90179202,
      back_rotation: 25.75279902,
      clv_rot_l: -6.32118666,
      clv_lift_l: 17.23004896,
      shoulder_add_l: 29.89581506,
      shoulder_rot_l: -48.65130472,
      shoulder_flex_l: -0.59642590,
      elbow_flexion_l: 7.79383471,
      pro_sup_l: -2.79336048,
      wrist_flex_l: 0.00000000,
      wrist_dev_l: 0.00000012,
    },
    labelId: ["test"],
  },
];*/