import { useState } from "react";
import { BodyPartVisualization } from "./bodyPart/BodyPartVisualization";
import { General } from "./General";
import Hand from "./Hand";
import { BigSelect } from "../../../common/Inputs";
import { GoTriangleDown } from "react-icons/go";
// import {Cognitive} from "./cognitive/Cognitive";

export const bodyParts = ['general', 'hand', 'shoulder', 'elbow'] as const // 'wrist', 'hand','cognitive' ] as const
export type BodyPart = typeof bodyParts[number]

export const Data = () =>
{
    const [selectedBodyPart, setSelectedBodyPart] =
        useState<BodyPart>('hand')


    const [period, setPeriod] = useState<'Week' | 'Month' | 'AllTime'>('AllTime');
    const [contrast, setContrast] = useState<string>(contrastSet['NOCONTENT']);

    const getDetail = () =>
    {
        switch (selectedBodyPart)
        {
            // case 'cognitive':
            //     return <Cognitive selectedBodyPart={selectedBodyPart} setSelectedBodyPart={setSelectedBodyPart}/>
            case 'general':
                return <General selectedBodyPart={selectedBodyPart} setSelectedBodyPart={setSelectedBodyPart} period={period} />
            case 'hand':
                return <Hand period={period} contrast={contrast} />
            default:
                return <BodyPartVisualization
                    selectedBodyPart={selectedBodyPart}
                    setSelectedBodyPart={setSelectedBodyPart} period={period} />
        }
    }
    //根据返回的selectedBodyPart来决定显示哪个组件

    return <div className={`bg-tertiary p-4 w-full shadow-inner @container`}>

        <BigSelect
            onValueSet={value => setSelectedBodyPart(value as BodyPart)}
            value={selectedBodyPart} values={bodyParts.map(part => ({ value: part, text: part }))}
            className={`ml-5`}
        />

        <div className='flex justify-between gap-4'>
            <div className='flex justify-start gap-4'>
                <button className={"flex flex-col items-center"} onClick={() => setPeriod('Week')}>
                    <span className={`btn-text ${period == 'Week' ? 'font-bold' : ''}`}>Week</span>{period == 'Week' &&
                        <GoTriangleDown className={`fill-primary`} />}
                </button>
                <button className={"flex flex-col items-center"} onClick={() => setPeriod('Month')}>
                    <span
                        className={`btn-text ${period == 'Month' ? 'font-bold' : ''}`}>Month</span>{period == 'Month' &&
                            <GoTriangleDown className={`fill-primary`} />}
                </button>
                <button className={"flex flex-col items-center"} onClick={() => setPeriod('AllTime')}>
                    <span
                        className={`btn-text ${period == 'AllTime' ? 'font-bold' : ''}`}>All time</span>{period == 'AllTime' &&
                            <GoTriangleDown className={`fill-primary`} />}
                </button>
            </div>
            {selectedBodyPart === 'hand' && <div className='flex justify-end gap-4 '>
                <button className={"flex flex-col items-center"} onClick={() => setContrast(contrastSet['NOCONTENT'])}>
                    <span className={`btn-text ${contrast == contrastSet['NOCONTENT'] ? 'font-bold' : ''}`}>{contrastSet['NOCONTENT']}</span>
                    {contrast == contrastSet['NOCONTENT'] &&
                        <GoTriangleDown className={`fill-primary`} />}
                </button>
                <button className={"flex flex-col items-center"} onClick={() => setContrast(contrastSet['UNAFFECTED'])}>
                    <span
                        className={`btn-text ${contrast == contrastSet['UNAFFECTED'] ? 'font-bold' : ''}`}>{contrastSet['UNAFFECTED']}</span>{contrast == contrastSet['UNAFFECTED'] &&
                            <GoTriangleDown className={`fill-primary`} />}
                </button>
                <button className={"flex flex-col items-center"} onClick={() => setContrast(contrastSet['MILESTONE'])}>
                    <span
                        className={`btn-text ${contrast == contrastSet['MILESTONE'] ? 'font-bold' : ''}`}>{contrastSet['MILESTONE']}</span>{contrast == contrastSet['MILESTONE'] &&
                            <GoTriangleDown className={`fill-primary`} />}
                </button>
                <button className={"flex flex-col items-center"} onClick={() => setContrast(contrastSet['BOTH'])}>
                    <span
                        className={`btn-text ${contrast == contrastSet['BOTH'] ? 'font-bold' : ''}`}>{contrastSet['BOTH']}</span>{contrast == contrastSet['BOTH'] &&
                            <GoTriangleDown className={`fill-primary`} />}
                </button>
            </div>}
        </div>
        {/* <br></br> */}
        {getDetail()}
    </div>
}

export const contrastSet: { [key: string]: string } = {
    'NOCONTENT': "No contrast",
    'UNAFFECTED': 'Unaffected hand',
    'MILESTONE': 'Milestone',
    'BOTH': 'Both of them'
}