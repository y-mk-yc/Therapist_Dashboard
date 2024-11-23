import {BodyPart, bodyParts} from "../Data";
import React, {FC, ReactNode, useState} from "react";
import {
    ElbowFlexionExtension,
    HorizontalShoulder,
    SideShoulder,
    VerticalShoulder,
} from "./RangeGraphs";
import {StrengthSpasticityFatigueColumn} from "../common/StrengthSpasticityFatigueColumn";
import {LabeledGraph} from "../common/LabeledGraph";
import {useGetPatientsByPatientIdDataQuery, MinMaxObject} from "../../../../store/rehybApi";
import {useParams} from "react-router-dom";
import {RangeData} from "../../../../common/graphs/rangeGraph/RangeGraph";
import {Loader} from "../../../../common/Loader";
import {GoTriangleDown} from "react-icons/go";
import {BigSelect} from "../../../../common/Inputs";

export const BodyPartVisualization: FC<{
    setSelectedBodyPart: (part: BodyPart) => void,
    selectedBodyPart: BodyPart
}> = ({setSelectedBodyPart, selectedBodyPart}) => {
    const {patientId} = useParams();
    const {data, isLoading} = useGetPatientsByPatientIdDataQuery({PatientID: patientId!});
    const [period, setPeriod] = useState<'Week' | 'Month' | 'AllTime'>('AllTime');

    const cutOffDate = new Date();
    cutOffDate.setHours(0, 0, 0, 0);
    if (period === 'Week') {
        cutOffDate.setDate(cutOffDate.getDate() - 6);
    } else if (period === 'Month') {
        cutOffDate.setDate(cutOffDate.getDate() - 29);
    } else {
        cutOffDate.setFullYear(1900, 0, 1); //设置为1900年1月1日,极限一点:)
    }


    if (isLoading) return <Loader/>

    if (!data) {
        return <span>No state variables for this patient.</span>
    }

    const createRangeDataROM = (progress: MinMaxObject[]): RangeData => {
        if (progress === undefined || progress.length === 0) {
            return [];
        } else {
            const sortedProgress = progress.slice().sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
            const lastActiveData = sortedProgress.length > 0 ? sortedProgress[sortedProgress.length - 1] : undefined;

            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            if(lastActiveData && new Date(lastActiveData.Date) < todayStart){
                sortedProgress.push({
                    Date: todayStart.toISOString(),
                    Min: lastActiveData.Min,
                    Max: lastActiveData.Max
                });
            }

            return sortedProgress.filter(item => new Date(item.Date) >= cutOffDate)
        }
    }


    const rangeVisuals: Record<BodyPart, ReactNode> = {
        //cognitive: <></>,
        general: <></>,
        shoulder: <>
            <HorizontalShoulder data={createRangeDataROM(data.Physical?.ROM?.AngleShoulderHFE)} period={period}/>
            <VerticalShoulder data={createRangeDataROM(data.Physical?.ROM?.AngleShoulderFE)} period={period}/>
            <SideShoulder data={createRangeDataROM(data.Physical?.ROM?.AngleShoulderIE)} period={period}/>
        </>,
        elbow: <ElbowFlexionExtension data={createRangeDataROM(data.Physical?.ROM?.AngleElbowFE)} period={period}/>,
        //wrist: <WristPronationSupination data={createRangeData(data!.wrist.PSProgress)}/>,
        //hand: <HandOpenClose data={createRangeData(data!.hand.OCProgress)}/>
    }


    return <div className={'flex flex-col w-full'}>
        <div className={`flex justify-between items-center`}>
            <BigSelect
                onValueSet={value => setSelectedBodyPart(value as BodyPart)}
                value={selectedBodyPart} values={bodyParts.map(part => ({value: part, text: part}))}
                className={`ml-5`}
            />
            <div className='flex justify-between gap-4'>
                <button className={"flex flex-col items-center"} onClick={() => setPeriod('Week')}>
                    <span className={`btn-text ${period == 'Week' ? 'font-bold' : ''}`}>Week</span>{period == 'Week' &&
                    <GoTriangleDown className={`fill-primary`}/>}
                </button>
                <button className={"flex flex-col items-center"} onClick={() => setPeriod('Month')}>
                    <span
                        className={`btn-text ${period == 'Month' ? 'font-bold' : ''}`}>Month</span>{period == 'Month' &&
                    <GoTriangleDown className={`fill-primary`}/>}
                </button>
                <button className={"flex flex-col items-center"} onClick={() => setPeriod('AllTime')}>
                    <span
                        className={`btn-text ${period == 'AllTime' ? 'font-bold' : ''}`}>All time</span>{period == 'AllTime' &&
                    <GoTriangleDown className={`fill-primary`}/>}
                </button>
            </div>
        </div>
        <div className={`flex flex-col overflow-x-auto md:flex-row md:space-x-0 space-y-4 md:space-y-0`}>
            <LabeledGraph
                label={'Range of motion'}
                className={`flex-1`}
                tip={`The range of motion graph shows the progress of the patient's range of motion over one week/one month/the entire period.`}
                classNameTip={'z-50 translate-y-[130%] ml-24 '}
            >
                {/*是shoulder就显示HorizontalShoulder,VerticalShoulder,SideShoulder，是elbow就显示ElbowFlexionExtension*/}
                {rangeVisuals[selectedBodyPart]}
            </LabeledGraph>
            <StrengthSpasticityFatigueColumn
                className={'flex-1'}
                spasticity={data.Physical?.Spasticity}
                strength={data.Physical?.Strength}
                timeToFatigue={data.Physical?.Endurance}
                cutOffDate={cutOffDate}
                bodyPart={selectedBodyPart}
            />
        </div>
    </div>
}