import React from 'react';
import PropTypes from 'prop-types';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { GripStrengthData, MovementPrecisionData, MovementAccuracyData, MovementSpeedData, FingerCoordinationData, FingerIndependenceData, DexterityData, PainData, RomData } from '../../../../store/dataApi';
import moment from 'moment-timezone';
import { generateDateNoData } from '../../../../utils/date';
import { CiCircleQuestion } from "react-icons/ci";
import { ReHybTooltip } from '../../../../common/dialogs/Tooltip';
import TooltipHand from '../../../../common/dialogs/Tooltip_hand';
type ChartData = {
    time: string;
    rom?: number;
    strength?: number;
    spatialDeviation?: number;
    completionAccuracy?: number;
    trajectoryComparison?: number;
    accuracy?: number;
    [key: string]: any; // for other dynamic keys

};

function LineGraphWrapper(props: {
    data: RomData[] | GripStrengthData[] | MovementPrecisionData[] | MovementAccuracyData[] | MovementSpeedData[] | FingerCoordinationData[] | FingerIndependenceData[] | DexterityData[] | PainData[];
    period: 'Week' | 'Month' | 'AllTime';
    title: string | null;
    legend?: string[];
    keys: string[];
    max?: number;
    min?: number;
    height?: number
    tip?: string,
    rightYaxis?: string,
    leftYaxis: string,
    allowDecimals?: boolean
    // leftAxixDataSets?: string[],
    // rightAxixDataSets?: string[],
})
{
    // const colors:string[] = {
    //     0: '#8884d8',
    //     1: '#DE194B',
    //     2: '#339999',
    //     'score': '#181718'
    // };
    const colors: string[] = [
        '#8884d8',
        '#DE194B',
        '#339999',
        '#181718'
    ];
    const formattedData: ChartData[] = props.data.map((entry) =>
    {
        let formattedEntry: ChartData = {
            time: moment(entry.time).tz('Europe/Copenhagen').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        };

        // Add properties based on the type of entry
        if ('romFE' in entry) formattedEntry.romFE = entry.romFE;
        if ('romDB' in entry) formattedEntry.romDB = entry.romDB;

        if ('strength' in entry) formattedEntry.strength = entry.strength;
        if ('spatialDeviation' in entry) formattedEntry.spatialDeviation = entry.spatialDeviation;
        if ('completionAccuracy' in entry) formattedEntry.completionAccuracy = entry.completionAccuracy;
        if ('trajectoryComparison' in entry) formattedEntry.trajectoryComparison = entry.trajectoryComparison;
        if ('precision' in entry) formattedEntry.precision = entry.precision;

        if ('accuracy' in entry) formattedEntry.accuracy = entry.accuracy;
        if ('speed' in entry) formattedEntry.speed = entry.speed;
        if ('coordination' in entry) formattedEntry.coordination = entry.coordination;

        if ('ATT' in entry) formattedEntry.ATT = entry.ATT;
        if ('TV' in entry) formattedEntry.TV = entry.TV;
        if ('CEC' in entry) formattedEntry.CEC = entry.CEC;



        if ('independence' in entry) formattedEntry.independence = entry.independence;
        if ('dexterity' in entry) formattedEntry.dexterity = entry.dexterity;
        if ('severity' in entry) formattedEntry.severity = entry.severity;
        if ('location' in entry) formattedEntry.location = entry.location;


        return formattedEntry;
    });
    let expectedDates;
    let existingData: any[];
    let mergedData;
    // Step 1: Generate expected dates and format them
    if (props.period === 'Month' || props.period === 'Week')
    {
        const expectedDates = generateDateNoData(props.period).map((date) =>
        {
            const formattedDate = moment(date).tz('Europe/Copenhagen').format('MMM-DD'); // Format as "Feb-16"

            // Find a matching entry in formattedData based on the same formatted date
            const matchingData = formattedData.find(
                (item) => moment(item.time).tz('Europe/Copenhagen').format('MMM-DD') === formattedDate
            );

            return matchingData
                ? { ...matchingData, formattedTime: formattedDate, time: formattedDate }
                : { time: formattedDate };
        });
        // Step 2: Convert existing data times to the same format
        existingData = formattedData.map((entry) => ({
            ...entry,
            time: moment(entry.time).tz('Europe/Copenhagen').format('MMM-DD'),
        }));


        // Step 3: Merge expected dates with existing data
        mergedData = expectedDates.map((dateEntry) =>
        {
            const matchingEntry = existingData.find((d) => d.time === dateEntry.time);
            return matchingEntry || { ...dateEntry }; // Keep missing data entries but without values
        });
    } else
    {
        expectedDates = formattedData.map((entry) => ({
            ...entry,
            time: moment(entry.time).tz('Europe/Copenhagen').format('MMM-DD'),
        }))
        existingData = formattedData.map((entry) => ({
            ...entry,
            time: moment(entry.time).tz('Europe/Copenhagen').format('MMM-DD'),
        }));
        mergedData = expectedDates.map((dateEntry) =>
        {
            const matchingEntry = existingData.find((d) => d.time === dateEntry.time);
            return matchingEntry || { ...dateEntry }; // Keep missing data entries but without values
        });
    }



    return (
        <div className="flex items-center gap-2 h-[300px] mt-4">
            <div className="flex flex-col gap-4 flex-1">
                <div className='flex w-full'>
                    <h4>{props.title}</h4>
                    {
                        props.tip &&
                        <div className="relative inline-block">
                            <TooltipHand content={props.tip} />
                        </div>

                    }</div>
                {(() =>
                {
                    return (
                        <div className="w-full h-[250px] "> {/* Set a specific height here */}

                            <ResponsiveContainer height='100%' width='100%'>

                                <LineChart
                                    // height={props.height ?? 250} 
                                    data={mergedData} margin={{ top: 20, right: 30, }} >
                                    <CartesianGrid stroke="#ccc" />
                                    {props.keys.length > 2 && (
                                        <>
                                            <YAxis
                                                yAxisId="right"
                                                label={{
                                                    value: props.rightYaxis, // Completion Accuracy
                                                    angle: 0,
                                                    position: 'top',
                                                    offset: 20,
                                                }}
                                                tick={{ fontSize: 12 }}
                                                orientation="right"
                                            />
                                            <Line yAxisId="right" type="monotone" dataKey={props.keys[1]} stroke={colors[1]} key={1} />
                                            <Line yAxisId="right" type="monotone" dataKey={props.keys[2]} stroke={colors[2]} key={2} />
                                            {/* <Line yAxisId="left" type="monotone" dataKey={props.keys[3]} stroke={colors[3]} key={3} /> */}
                                            <Legend
                                                verticalAlign="top"
                                                height={72}
                                                payload={props.legend!.map((value, index: number) => ({
                                                    value: value,
                                                    type: 'line',
                                                    color: colors[index],
                                                }))}
                                            />

                                        </>
                                    )}

                                    <XAxis
                                        dataKey="time"
                                        tick={(props) => renderCustomAxisTick({ ...props, width: 10, height: 30 })}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        label={{
                                            value: props.leftYaxis,
                                            angle: 0,
                                            position: 'top',
                                            offset: 20,
                                        }}
                                        domain={[props.min ?? 0, props.max ?? 'dataMax']}
                                        allowDecimals={props.allowDecimals ?? false}
                                        tickCount={10}
                                    />
                                    <Tooltip content={<CustomTooltip keys={props.keys} />} />

                                    <Line yAxisId="left" type="monotone" dataKey={props.keys[0]} stroke={colors[0]} label={(props) => renderCustomLineLabel({ ...props, width: 10, height: 30 })} />
                                    {/* {props.keys.length > 2 &&
                                        // <Line yAxisId="left" type="monotone" dataKey={props.keys[3]} stroke={'none'} strokeWidth={2} />
                                    } */}

                                </LineChart>
                            </ResponsiveContainer >
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}

const renderCustomAxisTick = ({ payload, x, y, width, height }: { payload?: any; x: number; y: number; width: number; height: number; }) =>
{
    return (
        <text x={x} y={y + height / 2} fill="#666" textAnchor="middle" dy={-6} className='text-sm'>
            {`${payload.value}`}
        </text>
    );
};
const renderCustomLineLabel = ({ payload, x, y, width, height, value }: { payload?: any; x: number; y: number; width: number; height: number; value: any }) =>
{
    return <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>{`${value}`}</text>;
};

const CustomTooltip = ({ active, payload, label, keys }: { active?: any, payload?: any, label?: any; keys: string[] }) =>
{
    if (payload && payload.length > 0)
    {
        // const { spatialDeviation, completionAccuracy, trajectoryComparison, precision } = payload[0].payload;
        return (
            <div className="custom-tooltip bg-slate-50">
                {/* <p>{`Time: ${label}`}</p> */}
                {
                    keys.map((key) => (
                        <p key={key}>{`${key}: ${payload[0].payload[key]}`}</p>
                    ))
                }



            </div>
        );
    }
    return null;
};

export default LineGraphWrapper;
