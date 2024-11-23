import React, {FC} from "react";
import {Endurance} from "../../../../store/rehybApi";
import {BodyPart} from "../Data";
import {LabeledGraph} from "./LabeledGraph";
import {LazyPlot} from "../../../../common/graphs/LazyPlotly";
import {getFormattedLocalDate} from "./ManualAssesmentButton";

const config: Partial<Plotly.Config> = {
    displaylogo: false,
    displayModeBar: false,
    responsive: true
};

const layout: Partial<Plotly.Layout> = {
    height: 300,
    width: 500,
    margin: {t: 0, b: 40, l: 30, r: 0},
    plot_bgcolor: 'rgba(255,255,255,0)',
    paper_bgcolor: 'rgba(255,255,255,0)',
    legend: {
        orientation: 'h',
    },
    xaxis: {
        tickformat: '%m/%d',
        tickfont: {
            size: 12
        },
        tickangle: 0
    },
    yaxis: {
        tickfont: {
            size: 12
        }
    },
};


const createDataConfigWithHover = (color: string, name: string, x: string[], y: number[], symbol?: string): Plotly.Data => {
    const localX = x.map(date => new Date(date).toLocaleDateString());
    return {
        x,
        y,
        type: 'scatter',
        mode: 'lines+markers',
        marker: {color, symbol, opacity: 0.7},
        name,
        hovertemplate: `<b>Date</b>: %{text}<br><b>TimeToFatigue</b>: %{y} minutes<extra></extra>`,
        text: localX,
    };
};

const filterAndSortData = (data: { Date: string, TimeToFatigue: number }[], cutOffDate: Date) => {
    const sortedData = data.slice().sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
    // const lastActiveData = sortedData.length > 0 ? sortedData[sortedData.length - 1] : undefined;
    // const today = new Date(new Date().setHours(0, 0, 0, 0));
    // if (lastActiveData) {
    //     let i = new Date(lastActiveData.Date);
    //     i.setDate(i.getDate() + 1);
    //     while (i <= today) {
    //         sortedData.push({
    //             Date: i.toISOString(),
    //             TimeToFatigue: lastActiveData.TimeToFatigue
    //         });
    //         i.setDate(i.getDate() + 1);
    //     }
    // }
    return sortedData.filter(item => new Date(item.Date) >= cutOffDate);
}

const getEnduranceData = (endurance: Endurance, bodyPart: BodyPart, cutOffDate: Date) => {
    if (bodyPart === 'shoulder') {
        return {
            dataShoulder: endurance?.Shoulder ? filterAndSortData(endurance.Shoulder, cutOffDate) : [],
        };
    } else if (bodyPart === 'elbow') {
        return {
            dataElbow: endurance?.Elbow ? filterAndSortData(endurance.Elbow, cutOffDate) : [],
        };
    } else {
        return {};
    }

}

export const EnduranceGraph: FC<{
    timeToFatigue: Endurance,
    cutOffDate: Date,
    bodyPart: BodyPart
}> = ({timeToFatigue, cutOffDate, bodyPart}) => {

    const {
        dataShoulder = [],
        dataElbow = []
    } = getEnduranceData(timeToFatigue, bodyPart, cutOffDate);

    const plotData = bodyPart === 'elbow' ? [
        createDataConfigWithHover('#435fe1', 'Elbow', dataElbow.map(d => d.Date), dataElbow.map(d => parseFloat(d.TimeToFatigue.toFixed(1))))
    ] : [
        createDataConfigWithHover('#435fe1', 'Shoulder', dataShoulder.map(d => d.Date), dataShoulder.map(d => parseFloat(d.TimeToFatigue.toFixed(1))))
    ];

    return (
        <LabeledGraph
            label={'Endurance'}
            tip={`The endurance graph shows the progress of the amount of time patient can exercise until they fatigue over one week/one month/the entire period.`}
            editInitialEndurance={{
                timeToFatigue: 0,
                date: getFormattedLocalDate(new Date()),
                bodyPart: bodyPart,

            }}
        >
            <div className={`flex flex-col`}>
                <div className={`flex justify-start`}>
                    TimeToFatigue(mins)
                </div>
                <LazyPlot
                    data={plotData}
                    layout={layout}
                    config={config}
                />
            </div>
        </LabeledGraph>
    );
}