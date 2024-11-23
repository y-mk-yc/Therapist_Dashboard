import {ArmRanges, getHandLocation} from "./rendering";
import {Vector3} from "three";
import video1 from './trials/trial01.mp4'
import video2 from './trials/trial02.mp4'

export type TrialRow = {
    "SFE": number,
    "SHFE": number,
    "SIE": number,
    "EFE": number,
}

export type Trial = {
    timeMap: Map<number, TrialRow>,
    handPositions: Vector3[],
    videoSrc: string,
    videoOffset: number,
    ranges: ArmRanges
}

// type ArmRanges = {     SHFE: [number,number];     SFE: [number,number];     EFE: [number,number];     SIE: [number,number]; }

export const getExerciseInfo = async (
    exercise: '01' | '02'
): Promise<Trial> => {
    // const exerciseData = exercise == '01' ? exerciseData1 : exerciseData2
    let exerciseData;
    if (exercise == '01') {
        exerciseData = (await import('./trials/trial01')).exerciseData1;
    } else {
        exerciseData = (await import('./trials/trial02')).exerciseData2;
    }
    //异步导入数据，根据01或者02选择不同的数据

    const timeMap = new Map<number, typeof exerciseData[number]>()

    for (const row of exerciseData) {
        //timeMap 是一个map，key是时间row.t，value是一个对象
        timeMap.set(row.t, {
            ...row,
            SHFE: row.SHFE + 280,
            SFE: row.SFE + 180,
            SIE: -row.SIE + 270,
            EFE: row.EFE
        })
    }


    const ranges: ArmRanges = {
        SHFE: [1000, -1000],
        SFE: [1000, -1000],
        EFE: [1000, -1000],
        SIE: [1000, -1000]
    }

    for (const row of timeMap.values()) {
        for (const key of Object.keys(ranges)) {
            // @ts-ignore
            if (row[key] < ranges[key][0]) {
                // @ts-ignore
                ranges[key][0] = Math.round(row[key])
            }
            // @ts-ignore
            if (row[key] > ranges[key][1]) {
                // @ts-ignore
                ranges[key][1] = Math.round(row[key])
            }
        }
    }

    const handPositions = Array.from(timeMap.values())
        .map(row => getHandLocation(row))

    const videoOffset = exercise == '01' ? 300 : 200
    const videoSrc = exercise == '01' ? video1 : video2

    return {timeMap, handPositions, videoSrc, videoOffset, ranges}
}

//01：
// {
//     timeMap: Map<number, TrialRow>, // 包含调整后的角度值的 Map
//     handPositions: Vector3[], // 根据 timeMap 计算得到的手的位置数组
//     videoSrc: string, // video1 的路径
//     videoOffset: 300, // 视频偏移量
//     ranges: {
//         SHFE: [288.78711, 289.22656],
//         SFE: [188.49194, 188.52078],
//         EFE: [0.518799, 0.535278],
//         SIE: [275.97250, 275.65750]
//     }
// }