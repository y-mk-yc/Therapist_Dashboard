import { IconInCircle } from '../../../../common/IconInCircle'
import { AiFillApple, AiOutlineBook } from 'react-icons/ai'
import { ReactNode } from 'react'
import { useGetPatientsByPatientIdExerciseSessionsAndExerciseSessionIdQuery } from "../../../../store/rehybApi";
import { useParams } from "react-router-dom";
import { Loader } from "../../../../common/Loader";
import { getDateString, getDifferenceInMinutes, parseDateOrToday, shortTimeStr } from "../../../../common/dateUtils";
import { SimplePlotlyLineGraph } from "../../../../common/graphs/SimplePlotlyLineGraph";

import { CompensationType_COLORS, LabelType } from './TypeColors';
import { LabeledColors } from './components/LabeledColors';
import { ProgressBar } from './components/ProgressBar';
import React, { FC, useEffect, useState, useRef, useMemo } from 'react';
import { LabeledHuman } from './components/LabeledHuman';

import { FrameRangeSlider } from './components/FrameRangeSlider';
import { CheckboxTable } from './components/CheckboxTable';
// import { Avatar } from './components/Avatar';
import { v4 as uuidv4 } from 'uuid';

import { AiFillCaretLeft, AiFillCaretRight, AiOutlineRollback } from "react-icons/ai";

// import { exampleData, exampleLabel } from './TestData/testData';
import { exampleData, exampleLabel } from './TestData/testData_Integration';
import { ManualCompensationRecord, MovementRecord, NewSessionData, PredictionCompensationRecord } from '../exerciseDetail_new/NewDataStructure';
import { compensationType, options, FrameData, Frame, Details, LabeledZone } from './TestData/LabelingDataStructure';
import { NewAvatar } from '../exerciseDetail_new/components/NewAvatar';

// export type compensationType = "Unable to determine" | "Healthy" |
//   "Torso flexion" | "Torso tilt" | "Torso rotation" | "Elevation plane" |
//   "Elevation angle" | "Shoulder rotation" | "Elbow flexion" | "Forearm rotation" |
//   "Wrist deviation" | "Wrist flexion" | "Other reason (Compensation)";

// const options: compensationType[] = [
//   "Unable to determine", "Healthy",
//   "Torso flexion", "Torso tilt", "Torso rotation", "Elevation plane",
//   "Elevation angle", "Shoulder rotation", "Elbow flexion", "Forearm rotation",
//   "Wrist deviation", "Wrist flexion", "Other reason (Compensation)"
// ];



// export type FrameData = {
//   time: number;
//   pelvis_tilt: number;
//   pelvis_list: number;
//   pelvis_rotation: number;
//   pelvis_tx: number;
//   pelvis_ty: number;
//   pelvis_tz: number;
//   back_tilt: number;
//   back_list: number;
//   back_rotation: number;
//   clv_rot_l: number;
//   clv_lift_l: number;
//   shoulder_add_l: number;
//   shoulder_rot_l: number;
//   shoulder_flex_l: number;
//   elbow_flexion_l: number;
//   pro_sup_l: number;
//   wrist_flex_l: number;
//   wrist_dev_l: number;
// }

// export type Frame = {
//   frameNumber: number;
//   data: FrameData;
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


//两个页面间的数据转换
export function formatDate(milliseconds: string): string {
  const date = new Date(Number(milliseconds));
  return date.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
}//固定格式(与之前的日期格式对应)



const convertMovementsToFrames = (movements: MovementRecord[]): Frame[] => {
  return movements.map((movement, index) => ({
    frameNumber: index,//保证从0开始
    data: movement,
    labelId: [""] // 初始化数组，稍后填充
  }));
};


const generateLabeledZones = (compensations: Array<ManualCompensationRecord | PredictionCompensationRecord>, frames: Frame[]): LabeledZone[] => {
  return compensations.map((compensation, index) => {
    const id = uuidv4(); // 生成唯一标识

    // 找到对应的帧范围-前提是t的数组是连续递增的！且标签的start和end的t在movement中是一定存在的！
    const startFrameIndex = frames.findIndex(frame => frame.data.t === compensation.t_start);
    const endFrameIndex = frames.findIndex(frame => frame.data.t === compensation.t_end);

    // 将 ID 写入对应 Frame 的 labelId
    if (startFrameIndex != -1 && endFrameIndex != -1) {
      for (let i = startFrameIndex; i <= endFrameIndex; i++) {
        if (i !== -1 && frames[i]) {//避免访问不存在的数组元素

          if (frames[i].labelId.length === 1 && frames[i].labelId[0] === "") {
            frames[i].labelId = []; // 清空数组
          }

          frames[i].labelId.push(id);//至少都会有一个id存在
        }
      }
    }

    // 确定type字段
    let type: LabelType = "Compensatory_Manually";//与checkbox的逻辑类似，先给一个初始值
    let therapistID: string = ""; // 默认为空字符串
    let date: string = "--"; //默认为"--"一定要与labeledhuman中的判断统一
    let comment: string = ""; //默认为""

    if (compensation.Type === "Prediction") {
      type = "Compensatory_SystemDetected";
      therapistID = "";
      date = "--";
      comment = "";
    } else if (compensation.Type === "Manual") {
      if (compensation.Label.length === 1) {
        switch (compensation.Label[0]) {
          case "Unable to determine":
            type = "UnableToDetermine";
            break;
          case "Healthy":
            type = "Healthy";
            break;
          case "Other reason (Compensation)":
            type = "Compensatory_Manually";
            break;
          default:
            type = "Compensatory_Manually";
        }
      } else {
        type = "Compensatory_Manually";
      }


      therapistID = compensation.ModificationInfo?.TherapistID || "";
      date = compensation.ModificationInfo?.Date ? compensation.ModificationInfo.Date.toString() : "--";
      comment = compensation.ModificationInfo?.Comment || "";
    }//这里假设每个标签都有Type，且类型只为Prediction或Manual，所以没加其他情况



    return {
      id,
      type,
      therapistID,
      therapistName: 'TestName', // 需要后续加上API，然后在上面的manual情况中获取
      date,
      details: {
        startFrame: frames[startFrameIndex].frameNumber,
        endFrame: frames[endFrameIndex].frameNumber,
        detailedType: compensation.Label,
        comment
      }
    };
  });
};


function transformSessionData(sessionData: NewSessionData) {
  const frames: Frame[] = convertMovementsToFrames(sessionData.Movements);//因为在detail页面只有movement有值时才会显示跳转按钮，所以这里应该是不需要再判断的
  // 检查是否有补偿数据，如果没有，则返回空数组
  const labeledZones = sessionData.Compensation && sessionData.Compensation.length > 0
    ? generateLabeledZones(sessionData.Compensation, frames)
    : [];
  console.log(frames, labeledZones);
  return { frames, labeledZones };
}




interface ExerciseLabelingProps {
  sessionInfo: NewSessionData;
  // setSessionInfo: React.Dispatch<React.SetStateAction<NewSessionData>>;
  setShowLabelingPage: React.Dispatch<React.SetStateAction<boolean>>;
}



export const ExerciseLabeling: React.FC<ExerciseLabelingProps> = ({ sessionInfo, setShowLabelingPage }) => {
  const { patientId } = useParams()

  const [TestFrames, setTestFrames] = useState<number[]>(exampleData.map(frame => frame.frameNumber));
  const [currentFrame, setCurrentFrame] = useState(0);
  const [Playing, setPlaying] = useState(false);
  const [isDoubleClick, setIsDoubleClick] = useState(false);
  const [startFrame, setStartFrame] = useState<number | null>(null);
  const [endFrame, setEndFrame] = useState<number | null>(null);
  const [isLabeling, setIsLabeling] = useState<boolean>(false);
  const [labelingValues, setLabelingValues] = useState<number[]>([0, 5]);
  const [labelStartFrame, setLabelStartFrame] = useState<number | null>(null);
  const [labelEndFrame, setLabelEndFrame] = useState<number | null>(null);
  const [singleLabeledZone, setSingleLabeledZone] = useState<LabeledZone | null>(null);

  // const [frames, setFrames] = useState(exampleData);
  // const [labeledZones, setLabeledZones] = useState(exampleLabel);

  const [frames, setFrames] = useState<Frame[]>([]);
  const [labeledZones, setLabeledZones] = useState<LabeledZone[]>([]);


  const frameData = useMemo(() => frames.map(frame => frame.data), [frames]);

  const [filteredZones, setFilteredZones] = useState<LabeledZone[]>([]);


  const parentRef = useRef<HTMLDivElement>(null);

  const intervalOptions = [100, 50, 33, 25, 20, 17, 14, 12, 11, 10];

  const [currentIntervalIndex, setCurrentIntervalIndex] = useState(4);

  // let intervalId: number | null = null;
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const increaseInterval = () => {
    setCurrentIntervalIndex(prev => Math.min(prev + 1, intervalOptions.length - 1));
  };

  const decreaseInterval = () => {
    setCurrentIntervalIndex(prev => Math.max(prev - 1, 0));
  };



  useEffect(() => {
    if (sessionInfo) {
      const { frames, labeledZones } = transformSessionData(sessionInfo);
      setFrames(frames);
      setLabeledZones(labeledZones);
    }
  }, [sessionInfo]);



  useEffect(() => {
    if (isLabeling) {
      const newTestFrames = Array.from(
        { length: labelingValues[1] - labelingValues[0] + 1 },
        (_, index) => labelingValues[0] + index
      );
      setTestFrames(newTestFrames);
    } else {
      setTestFrames(frames.map(frame => frame.frameNumber));
    }
    console.log('TestFrames:', TestFrames);
  }, [isLabeling, labelingValues, frames]);


  useEffect(() => {
    if (Playing) {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }

      intervalIdRef.current = setInterval(() => {
        setCurrentFrame(prevFrame => {
          const currentIndex = TestFrames.indexOf(prevFrame);
          if (currentIndex === -1) {
            console.log(currentIndex, TestFrames[0], 'out of testframes');
            return TestFrames[0];
          }

          const nextIndex = (currentIndex + 1) % TestFrames.length;
          return TestFrames[nextIndex];
        });
      }, intervalOptions[currentIntervalIndex]);
    } else {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    }
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    }
  }, [Playing, TestFrames, currentIntervalIndex]);



  useEffect(() => {
    if (isLabeling && startFrame !== null && endFrame !== null) {
      setLabelingValues([startFrame, endFrame]);

      const gap = Math.max(1, Math.floor((endFrame - startFrame) / 5));

      const newLabelStartFrame = startFrame - gap < 0 ? 0 : startFrame - gap;
      const newLabelEndFrame = endFrame + gap > TestFrames.length - 1 ? TestFrames.length - 1 : endFrame + gap;

      setLabelStartFrame(newLabelStartFrame);
      setLabelEndFrame(newLabelEndFrame);
    }
  }, [isLabeling]);



  const handlePlayPause = () => {
    setPlaying(prevPlaying => !prevPlaying);
  };


  const switchPage = () => {
    setShowLabelingPage(false);
  };


  // const exportData = () => {
  //   const dataToExport = {
  //     frames: frames.map(frame => ({
  //       frameNumber: frame.frameNumber,
  //       data: {
  //         time: frame.data.time,
  //         pelvis_tilt: frame.data.pelvis_tilt,
  //         pelvis_list: frame.data.pelvis_list,
  //         pelvis_rotation: frame.data.pelvis_rotation,
  //         pelvis_tx: frame.data.pelvis_tx,
  //         pelvis_ty: frame.data.pelvis_ty,
  //         pelvis_tz: frame.data.pelvis_tz,
  //         back_tilt: frame.data.back_tilt,
  //         back_list: frame.data.back_list,
  //         back_rotation: frame.data.back_rotation,
  //         clv_rot_l: frame.data.clv_rot_l,
  //         clv_lift_l: frame.data.clv_lift_l,
  //         shoulder_add_l: frame.data.shoulder_add_l,
  //         shoulder_rot_l: frame.data.shoulder_rot_l,
  //         shoulder_flex_l: frame.data.shoulder_flex_l,
  //         elbow_flexion_l: frame.data.elbow_flexion_l,
  //         pro_sup_l: frame.data.pro_sup_l,
  //         wrist_flex_l: frame.data.wrist_flex_l,
  //         wrist_dev_l: frame.data.wrist_dev_l
  //       },
  //       labelId: frame.labelId
  //     })),
  //     labeledZones: labeledZones.map(zone => ({
  //       id: zone.id,
  //       type: zone.type,
  //       therapistID: zone.therapistID,
  //       therapistName: zone.therapistName,
  //       date: zone.date,
  //       details: {
  //         startFrame: zone.details.startFrame,
  //         endFrame: zone.details.endFrame,
  //         detailedType: zone.details.detailedType,
  //         comment: zone.details.comment
  //       }
  //     }))
  //   };

  //   const json = JSON.stringify(dataToExport, null, 2);
  //   const blob = new Blob([json], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;

  //   const uniqueId = uuidv4();
  //   a.download = `FramesAndLabels_${uniqueId}.json`;
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);
  // };

  // const handleLabeledData = (data: any) => {
  //   const { frames, labeledZones } = data;
  //   setFrames(frames);
  //   setLabeledZones(labeledZones);
  //   setCurrentFrame(0);
  //   console.log(frames, labeledZones);
  // };

  // const handleRawData = (jsonData: any[]) => {
  //   const frames = jsonData.map((data, index) => ({
  //     frameNumber: index,
  //     data: {
  //       time: data.t,
  //       pelvis_tilt: 0,
  //       pelvis_list: 0,
  //       pelvis_rotation: 0,
  //       pelvis_tx: 0,
  //       pelvis_ty: 0.950,
  //       pelvis_tz: 0,
  //       back_tilt: 0,
  //       back_list: 0,
  //       back_rotation: 0,
  //       clv_rot_l: 0,
  //       clv_lift_l: 0,
  //       shoulder_add_l: 0,
  //       shoulder_rot_l: 0,
  //       shoulder_flex_l: data.SFE,
  //       elbow_flexion_l: data.EFE,
  //       pro_sup_l: 0,
  //       wrist_flex_l: 0,
  //       wrist_dev_l: 0
  //     },
  //     labelId: [""]
  //   }));

  //   const labeledZones: LabeledZone[] = [];

  //   setFrames(frames);
  //   setLabeledZones(labeledZones);
  //   setCurrentFrame(0);
  //   console.log(frames, labeledZones);
  // };


  // const importData = () => {
  //   const input = document.createElement('input');
  //   input.type = 'file';
  //   input.multiple = false;

  //   input.addEventListener('change', (event) => {
  //     const file = (event.target as HTMLInputElement)?.files?.[0] ?? null;
  //     if (file) {
  //       const reader = new FileReader();

  //       reader.onload = (e) => {
  //         try {
  //           const textData = e.target?.result as string;

  //           let parsedData;
  //           try {
  //             parsedData = JSON.parse(textData);
  //           } catch (err) {
  //             const jsonData = textData.split('\n').filter(line => line.trim() !== '').map(line => JSON.parse(line));
  //             if (jsonData.length > 0 && jsonData[0].SFE !== undefined && jsonData[0].EFE !== undefined && jsonData[0].t !== undefined) {
  //               handleRawData(jsonData);
  //               alert("Uploaded successfully!");
  //               return;
  //             } else {
  //               alert("Unrecognized data format!");
  //               return;
  //             }
  //           }

  //           if (parsedData.frames && parsedData.labeledZones) {
  //             handleLabeledData(parsedData);
  //             alert("Uploaded successfully!");
  //           } else {
  //             alert("Unrecognized data format!");
  //           }

  //         } catch (error) {
  //           console.error("Error while parsing JSON data: ", error);
  //           alert("Error while parsing JSON data!");
  //         } finally {
  //           input.remove();
  //         }

  //       };

  //       reader.readAsText(file);
  //     } else {
  //       alert("No file selected!");
  //     }
  //   });

  //   input.click();

  // };


  return <div className='flex flex-col gap-4'>
    <h4 className='leading-none'>Session Nr. {111111}</h4>
    {/* TODO props.sessionId改成实际的*/}
    <div className='flex gap-8 flex-wrap'>
      <div className='flex flex-col gap-4 flex-[4]'>
        <div className='flex items-center justify-between flex-wrap h-10'>
          <div className='flex items-center'>
            <h2>Exercise animation</h2>
            {(!isDoubleClick && !isLabeling) && (
              <div className=' bg-blue-600 rounded-md ml-2'>
                <AiOutlineRollback size={24} style={{ cursor: 'pointer' }} onClick={switchPage} />
              </div>
            )}
          </div>
          <div className='flex items-center'>

            {/* {(!Playing && !isDoubleClick && !isLabeling) && (
              <div className='flex items-center mr-2'>

                <button className='btn-secondary mr-2' onClick={importData}>
                  Import
                </button>

                <button className='btn-secondary' onClick={exportData}>
                  Export
                </button>
              </div>
            )} */}

            {!isDoubleClick && (
              <div className='flex items-center'>

                {!Playing && (
                  <div className='flex items-center mr-2'>
                    <p className="text-black">Speed: </p>
                    <AiFillCaretLeft onClick={decreaseInterval} className='w-8 h-8 fill-black cursor-pointer' />
                    <p className="text-black">{currentIntervalIndex + 1}</p>
                    <AiFillCaretRight onClick={increaseInterval} className='w-8 h-8 fill-black cursor-pointer' />
                  </div>
                )}

                <button className='btn-primary' onClick={handlePlayPause}>
                  {Playing ? 'Pause' : 'Play'}
                </button>
              </div >
            )}
          </div>
        </div>
        <div ref={parentRef} className='h-80'>
          <NewAvatar
            data={frameData}
            currentFrame={currentFrame}
            parentRef={parentRef}
          ></NewAvatar>
        </div>
        {!isLabeling && (
          <div>
            <div className="current-frame">Current Frame: {currentFrame} / {TestFrames.length - 1}</div>
            <ProgressBar
              frames={TestFrames}
              currentFrame={currentFrame}
              setCurrentFrame={setCurrentFrame}
              Playing={Playing}
              setPlaying={setPlaying}
              isDoubleClick={isDoubleClick}
              setIsDoubleClick={setIsDoubleClick}

              startFrame={startFrame}
              setStartFrame={setStartFrame}
              endFrame={endFrame}
              setEndFrame={setEndFrame}
              isLabeling={isLabeling}
              setIsLabeling={setIsLabeling}

              labeledZone={labeledZones}
              singleLabeledZone={singleLabeledZone}
              setSingleLabeledZone={setSingleLabeledZone}

              filteredZones={filteredZones}
              setFilteredZones={setFilteredZones}
            />
          </div>
        )}
        {(isLabeling && labelStartFrame !== null && labelEndFrame !== null) && (
          <div className='flex flex-col gap-4'>
            <div>Current Frame: {currentFrame}</div>
            <FrameRangeSlider
              step={1}
              min={labelStartFrame}
              max={labelEndFrame}
              values={labelingValues}
              setValues={setLabelingValues}
              currentFrame={currentFrame}
            ></FrameRangeSlider>
            <div>
              <LabeledColors colors={CompensationType_COLORS}></LabeledColors>
            </div>
          </div>
        )}

      </div>
      <div className='flex flex-col gap-4 flex-[2]'>
        {!isLabeling && (
          <div>
            <LabeledHuman
              data={frames}
              labeledZone={filteredZones}
              currentFrame={currentFrame}
            ></LabeledHuman>
          </div>
        )}
        {isLabeling && (
          <CheckboxTable
            options={options}
            values={labelingValues}
            setCurrentFrame={setCurrentFrame}
            setIsLabeling={setIsLabeling}
            singleLabeledZone={singleLabeledZone}
            setSingleLabeledZone={setSingleLabeledZone}
            frames={frames}
            setFrames={setFrames}
            labeledZones={labeledZones}
            setLabeledZones={setLabeledZones}
            setPlaying={setPlaying}
          ></CheckboxTable>
        )}
      </div>



    </div>
  </div>
}
