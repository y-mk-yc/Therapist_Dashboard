import {ReactNode, useEffect, useState} from "react";
import {RangeData, RangeGraph} from "../../../../common/graphs/rangeGraph/RangeGraph";
import {ROMManualAssessmentButton,getFormattedLocalDate} from "../common/ManualAssesmentButton";
import {PatientIdManualAssessmentBody} from "../../../../store/rehybApi";

export const RangeGraphWrapper = (props: {
    title: string
    data: RangeData,
    svgBuilder: (shownDato: Omit<RangeData[number], 'Date'>|undefined) => ReactNode,
    type: PatientIdManualAssessmentBody['variable']
    padding?: number,
    period: 'Week' | 'Month' | 'AllTime'
}) => {

    const latestData = props.data[props.data.length - 1];
    const [shownAngle, setShownAngle] =
        useState<Omit<RangeData[number], 'Date'>|undefined>(latestData?{Min: latestData.Min, Max: latestData.Max}:undefined);
    //设置默认的显示角度为最新的数据,前提是有数据
    useEffect(() => {
        setShownAngle(latestData?{Min: latestData.Min, Max: latestData.Max}:undefined);
    }, [latestData]);
    return <div className={'flex items-center gap-2 h-[300px],mt-4'}>
        <div className={'flex flex-col gap-4 flex-1'}>
            <div className={'flex justify-between'}>
                <h4>{props.title}</h4>
                <ROMManualAssessmentButton initial={{
                    variable: props.type,  //值类型，包括"SHFE" | "SFE" | "SIE" | "EFE" | "WPS" | "HOC";
                    minAngle: 0,
                    maxAngle: 180,
                    date: getFormattedLocalDate(new Date()), //当前的ISOstring
                }}/>
            </div>
            <div>
                Angle(°)
            </div>
            <RangeGraph
                data={props.data}
                onDataHover={setShownAngle} //鼠标移入时，显示当前的数据
                onHoverLeft={() => {
                    if(latestData) {
                        setShownAngle({Min: latestData.Min, Max: latestData.Max});
                    }else{
                        setShownAngle(undefined);
                    }
                } } //鼠标移出时，显示最新的数据
                period={props.period}
            />
        </div>
        <div className={`rounded p-${props.padding ?? 6} bg-tertiary h-fit w-fit`}>
            {props.svgBuilder(shownAngle)}
        </div>
    </div>
}