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

export const exampleData: Frame[] = [
  {
    frameNumber: 0,
    data: {
      t: 11111,
      SFE: 1,
      SHFE: 2,
      SIE: 11,
      EFE: 12,
      RE: 1,
      A_trunk_Z: 1,
      A_trunk_Y: 1,
      A_trunk_X: -1,
      G_trunk_Z: -1,
      G_trunk_Y: 1,
      G_trunk_X: 1,
      M_trunk_Z: -1,
      M_trunk_Y: -1,
      M_trunk_X: -1,
      A_arm_Z: -1,
      A_arm_Y: 1,
      A_arm_X: 1,
      G_arm_Z: -1,
      G_arm_Y: 1,
      G_arm_X: 1,
      M_arm_Z: -1,
      M_arm_Y: 1,
      M_arm_X: -1
    },
    labelId: [""],
  },
  {
    frameNumber: 1,
    data: {
      t: 11112,
      SFE: 45,
      SHFE: 45,
      SIE: 45,
      EFE: 45,
      RE: 1,
      A_trunk_Z: 1,
      A_trunk_Y: 1,
      A_trunk_X: -1,
      G_trunk_Z: -1,
      G_trunk_Y: 1,
      G_trunk_X: 1,
      M_trunk_Z: -1,
      M_trunk_Y: -1,
      M_trunk_X: -1,
      A_arm_Z: -1,
      A_arm_Y: 1,
      A_arm_X: 1,
      G_arm_Z: -1,
      G_arm_Y: 1,
      G_arm_X: 1,
      M_arm_Z: -1,
      M_arm_Y: 1,
      M_arm_X: -1
    },
    labelId: ["550e8400-e29b-41d4-a716-446655440000"],
  },
  {
    frameNumber: 2,
    data: {
      t: 11113,
      SFE: 10,
      SHFE: 20,
      SIE: 10,
      EFE: 20,
      RE: 1,
      A_trunk_Z: 1,
      A_trunk_Y: 1,
      A_trunk_X: -1,
      G_trunk_Z: -1,
      G_trunk_Y: 1,
      G_trunk_X: 1,
      M_trunk_Z: -1,
      M_trunk_Y: -1,
      M_trunk_X: -1,
      A_arm_Z: -1,
      A_arm_Y: 1,
      A_arm_X: 1,
      G_arm_Z: -1,
      G_arm_Y: 1,
      G_arm_X: 1,
      M_arm_Z: -1,
      M_arm_Y: 1,
      M_arm_X: -1
    },
    labelId: ["f47ac10b-58cc-4372-a567-0e02b2c3d479", "3dfc6e9e-23ab-4c0a-84b5-7f4a0d3834e5"],
  },
  {
    frameNumber: 3,
    data: {
      t: 11114,
      SFE: 21,
      SHFE: 20,
      SIE: 10,
      EFE: 20,
      RE: 1,
      A_trunk_Z: 1,
      A_trunk_Y: 1,
      A_trunk_X: -1,
      G_trunk_Z: -1,
      G_trunk_Y: 1,
      G_trunk_X: 1,
      M_trunk_Z: -1,
      M_trunk_Y: -1,
      M_trunk_X: -1,
      A_arm_Z: -1,
      A_arm_Y: 1,
      A_arm_X: 1,
      G_arm_Z: -1,
      G_arm_Y: 1,
      G_arm_X: 1,
      M_arm_Z: -1,
      M_arm_Y: 1,
      M_arm_X: -1
    },
    labelId: ["f47ac10b-58cc-4372-a567-0e02b2c3d479", "3dfc6e9e-23ab-4c0a-84b5-7f4a0d3834e5"],
  },
  {
    frameNumber: 4,
    data: {
      t: 11115,
      SFE: 12,
      SHFE: 20,
      SIE: 10,
      EFE: 20,
      RE: 1,
      A_trunk_Z: 1,
      A_trunk_Y: 1,
      A_trunk_X: -1,
      G_trunk_Z: -1,
      G_trunk_Y: 1,
      G_trunk_X: 1,
      M_trunk_Z: -1,
      M_trunk_Y: -1,
      M_trunk_X: -1,
      A_arm_Z: -1,
      A_arm_Y: 1,
      A_arm_X: 1,
      G_arm_Z: -1,
      G_arm_Y: 1,
      G_arm_X: 1,
      M_arm_Z: -1,
      M_arm_Y: 1,
      M_arm_X: -1
    },
    labelId: ["3dfc6e9e-23ab-4c0a-84b5-7f4a0d3834e5", "7d8c0dbf-eedb-4ae3-aa6e-2b91af016795"],
  },
  {
    frameNumber: 5,
    data: {
      t: 11116,
      SFE: 23,
      SHFE: 20,
      SIE: 10,
      EFE: 20,
      RE: 1,
      A_trunk_Z: 1,
      A_trunk_Y: 1,
      A_trunk_X: -1,
      G_trunk_Z: -1,
      G_trunk_Y: 1,
      G_trunk_X: 1,
      M_trunk_Z: -1,
      M_trunk_Y: -1,
      M_trunk_X: -1,
      A_arm_Z: -1,
      A_arm_Y: 1,
      A_arm_X: 1,
      G_arm_Z: -1,
      G_arm_Y: 1,
      G_arm_X: 1,
      M_arm_Z: -1,
      M_arm_Y: 1,
      M_arm_X: -1
    },
    labelId: ["7d8c0dbf-eedb-4ae3-aa6e-2b91af016795"],
  },
  {
    frameNumber: 6,
    data: {
      t: 11117,
      SFE: 14,
      SHFE: 20,
      SIE: 10,
      EFE: 20,
      RE: 1,
      A_trunk_Z: 1,
      A_trunk_Y: 1,
      A_trunk_X: -1,
      G_trunk_Z: -1,
      G_trunk_Y: 1,
      G_trunk_X: 1,
      M_trunk_Z: -1,
      M_trunk_Y: -1,
      M_trunk_X: -1,
      A_arm_Z: -1,
      A_arm_Y: 1,
      A_arm_X: 1,
      G_arm_Z: -1,
      G_arm_Y: 1,
      G_arm_X: 1,
      M_arm_Z: -1,
      M_arm_Y: 1,
      M_arm_X: -1
    },
    labelId: [""],
  },
  {
    frameNumber: 7,
    data: {
      t: 11118,
      SFE: 25,
      SHFE: 20,
      SIE: 10,
      EFE: 20,
      RE: 1,
      A_trunk_Z: 1,
      A_trunk_Y: 1,
      A_trunk_X: -1,
      G_trunk_Z: -1,
      G_trunk_Y: 1,
      G_trunk_X: 1,
      M_trunk_Z: -1,
      M_trunk_Y: -1,
      M_trunk_X: -1,
      A_arm_Z: -1,
      A_arm_Y: 1,
      A_arm_X: 1,
      G_arm_Z: -1,
      G_arm_Y: 1,
      G_arm_X: 1,
      M_arm_Z: -1,
      M_arm_Y: 1,
      M_arm_X: -1
    },
    labelId: ["7d8c0dbf-eedb-4ae3-aa6e-2b91af111111", "test"],
  },
  {
    frameNumber: 8,
    data: {
      t: 11119,
      SFE: 16,
      SHFE: 20,
      SIE: 10,
      EFE: 20,
      RE: 1,
      A_trunk_Z: 1,
      A_trunk_Y: 1,
      A_trunk_X: -1,
      G_trunk_Z: -1,
      G_trunk_Y: 1,
      G_trunk_X: 1,
      M_trunk_Z: -1,
      M_trunk_Y: -1,
      M_trunk_X: -1,
      A_arm_Z: -1,
      A_arm_Y: 1,
      A_arm_X: 1,
      G_arm_Z: -1,
      G_arm_Y: 1,
      G_arm_X: 1,
      M_arm_Z: -1,
      M_arm_Y: 1,
      M_arm_X: -1
    },
    labelId: ["7d8c0dbf-eedb-4ae3-aa6e-2b91af111111", "test"],
  },
  {
    frameNumber: 9,
    data: {
      t: 11120,
      SFE: 27,
      SHFE: 20,
      SIE: 10,
      EFE: 20,
      RE: 1,
      A_trunk_Z: 1,
      A_trunk_Y: 1,
      A_trunk_X: -1,
      G_trunk_Z: -1,
      G_trunk_Y: 1,
      G_trunk_X: 1,
      M_trunk_Z: -1,
      M_trunk_Y: -1,
      M_trunk_X: -1,
      A_arm_Z: -1,
      A_arm_Y: 1,
      A_arm_X: 1,
      G_arm_Z: -1,
      G_arm_Y: 1,
      G_arm_X: 1,
      M_arm_Z: -1,
      M_arm_Y: 1,
      M_arm_X: -1
    },
    labelId: ["test"],
  },
];