import { MovementRecord } from "../../exerciseDetail_new/NewDataStructure";
import { LabelType } from "../TypeColors";



export type compensationType = "Unable to determine" | "Healthy" |
    "Torso flexion" | "Torso tilt" | "Torso rotation" | "Elevation plane" |
    "Elevation angle" | "Shoulder rotation" | "Elbow flexion" | "Forearm rotation" |
    "Wrist deviation" | "Wrist flexion" | "Other reason (Compensation)";

export const options: compensationType[] = [
    "Unable to determine", "Healthy",
    "Torso flexion", "Torso tilt", "Torso rotation", "Elevation plane",
    "Elevation angle", "Shoulder rotation", "Elbow flexion", "Forearm rotation",
    "Wrist deviation", "Wrist flexion", "Other reason (Compensation)"
];



export type FrameData = {
    time: number;
    pelvis_tilt: number;
    pelvis_list: number;
    pelvis_rotation: number;
    pelvis_tx: number;
    pelvis_ty: number;
    pelvis_tz: number;
    back_tilt: number;
    back_list: number;
    back_rotation: number;
    clv_rot_l: number;
    clv_lift_l: number;
    shoulder_add_l: number;
    shoulder_rot_l: number;
    shoulder_flex_l: number;
    elbow_flexion_l: number;
    pro_sup_l: number;
    wrist_flex_l: number;
    wrist_dev_l: number;
}

//TODO:下面的data类型定义只是把FrameData变成了MovementRecord，但是在Avatar.tsx中调用它的代码还是用FrameData，并没有更新。
// 只是调用它的Avatar.tsx文件被废弃了没有用。by Song
export type Frame = {
    frameNumber: number;//注意从0开始，整数递增
    // data: FrameData;//改成MovementRecord
    data: MovementRecord;
    labelId: string[];
}
//TODO:2024.8.26 修改 by Song
export type Details = {
    startFrame: number;
    endFrame: number;
    detailedType: Array<compensationType>;
    comment: string;
}

export type LabeledZone = {
    id: string;
    type: LabelType;//加上对应关系
    therapistID: string;
    therapistName: string;//api获取
    date: string;//ms要转换为本地时间
    details: Details;
}