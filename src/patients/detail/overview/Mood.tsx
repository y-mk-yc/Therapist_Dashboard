import { Chip } from './common/Chip'
import { useState } from 'react'
import { SimplePlotlyLineGraphPatientMood } from "../../../common/graphs/SimplePlotlyLineGraph";
import { MoodEntry, useGetMoodAssessmentsQuery } from "../../../store/rehybApi";
import { useParams } from "react-router-dom";
import { LazyPlot } from "../../../common/graphs/LazyPlotly";

const COLORS = [
    '#74e03e',
    '#e0ca3e',
    '#DD5505'
]

const createPieData: (data: number[]) => Plotly.Data[] = (data) => [{
    values: data,
    marker: {
        colors: COLORS
    },
    domain: { column: 0 },
    type: 'pie',
}]

const pieLayout: Partial<Plotly.Layout> = {
    showlegend: false,
    height: 160,
    width: 200,
    margin: { t: 16, b: 16, l: 16, r: 16 },
}

const config: Partial<Plotly.Config> = {
    staticPlot: true,
}

export const Mood = () =>
{
    const [view, setView] = useState<'ALL_TIME' | 'LAST_7_DAYS'>('ALL_TIME')
    const { patientId } = useParams()
    const { data } = useGetMoodAssessmentsQuery({ PatientID: patientId! })

    let moodData: MoodEntry[] = [];
    let moodData7: MoodEntry[] = [];
    if (data)
    {
        moodData = data.moodAll ?? [];
        moodData7 = data.moodInSevenDays ?? [];
    }

    const last7Days = Array.from({ length: 7 }, (_, i) =>
    {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return { date } as { date: Date, Mood: number | null };
    });
    for (const item of last7Days)
    {
        const mood = moodData7.find(d => new Date(d.Date).toDateString() === item.date.toDateString());
        if (mood)
        {
            item.Mood = mood.Mood === 'Positive' ? 1 : mood.Mood === 'Neutral' ? 0 : -1;
        } else
        {
            item.Mood = null;
        }
    }

    //{Mood: string, Date: string}，将情绪和时间数组根据情绪变成数字数组
    const lineData = last7Days.map(entry => entry.Mood);
    const dates = last7Days.map(entry => entry.date.toISOString());

    const countMoodType = (moodType: string) => moodData.filter(item => item.Mood === moodType).length; //根据情绪类型统计数量

    const pieData = createPieData([
        countMoodType('Positive'),
        countMoodType('Neutral'),
        countMoodType('Negative')
    ])

    return <>
        <div className='flex justify-between gap-4'>
            <h3 className={'whitespace-nowrap'}>Patient mood</h3>
            <div className='flex gap-2'>
                <button
                    onClick={() => setView('ALL_TIME')}
                    className={`btn-text ${view == 'ALL_TIME' ? 'font-semibold' : ''}`}>All time
                </button>
                <button
                    onClick={() => setView('LAST_7_DAYS')}
                    className={`btn-text ${view == 'LAST_7_DAYS' ? 'font-semibold' : ''}`}>Last 7 days
                </button>
            </div>
        </div>
        <div className='flex gap-4 items-center justify-center h-full w-full'>
            {view == 'ALL_TIME' && <>
                <LazyPlot data={pieData} layout={pieLayout} config={config} />
                <div className={'flex flex-col'}>
                    <div className={'flex gap-2 items-center'}><Chip color={COLORS[0]} />Positive</div>
                    <div className={'flex gap-2 items-center'}><Chip color={COLORS[1]} />Neutral</div>
                    <div className={'flex gap-2 items-center'}><Chip color={COLORS[2]} />Negative</div>
                </div>
            </>}
            {view == 'LAST_7_DAYS' && <>
                <SimplePlotlyLineGraphPatientMood data={lineData} dates={dates} height={160} width={320} />
            </>}
        </div>
    </>
}