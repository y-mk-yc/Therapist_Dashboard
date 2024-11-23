import React, {FC} from "react";
import {Strength} from "../../../../store/rehybApi";
import {LabeledGraph} from "./LabeledGraph";
import {LazyPlot} from "../../../../common/graphs/LazyPlotly";
import {BodyPart} from "../Data";
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
        hovertemplate: `<b>Date</b>: %{text}<br><b>Torque</b>: %{y} N⋅m<extra></extra>`,
        text: localX,
    };
};

const filterAndSortData = (data: { Torque: number, Date: string }[], cutOffDate: Date) => {
    const sortedData = data.slice().sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
    // const lastActiveData = sortedData.length > 0 ? sortedData[sortedData.length - 1] : undefined;
    // const today = new Date(new Date().setHours(0, 0, 0, 0));
    // if (lastActiveData) {
    //     let i = new Date(lastActiveData.Date);
    //     i.setDate(i.getDate() + 1);
    //     while (i <= today) {
    //         sortedData.push({
    //             Date: i.toISOString(),
    //             Torque: lastActiveData.Torque
    //         });
    //         i.setDate(i.getDate() + 1);
    //     }
    // }
    return sortedData.filter(item => new Date(item.Date) >= cutOffDate);
};

const getStrengthData = (strength: Strength, bodyPart: BodyPart, cutOffDate: Date) => {
    if (bodyPart === 'shoulder') {
        return {
            dataShoulderFE: strength?.RequiredSupportShoulderFE ? filterAndSortData(strength.RequiredSupportShoulderFE, cutOffDate) : [],
            dataShoulderHFE: strength?.RequiredSupportShoulderHFE ? filterAndSortData(strength.RequiredSupportShoulderHFE, cutOffDate) : [],
            dataShoulderIE: strength?.RequiredSupportShoulderIE ? filterAndSortData(strength.RequiredSupportShoulderIE, cutOffDate) : [],
        };
    } else if (bodyPart === 'elbow') {
        return {
            dataElbowFE: strength?.RequiredSupportElbowFE ? filterAndSortData(strength.RequiredSupportElbowFE, cutOffDate) : [],
        };
    } else {
        return {};
    }
};

export const StrengthGraph: FC<{
    strength: Strength,
    cutOffDate: Date,
    bodyPart: BodyPart,
}> = ({strength, bodyPart, cutOffDate}) => {
    const {
        dataShoulderFE = [],
        dataShoulderHFE = [],
        dataShoulderIE = [],
        dataElbowFE = []
    } = getStrengthData(strength, bodyPart, cutOffDate);

    const plotData = bodyPart === 'elbow' ? [
        createDataConfigWithHover('#435fe1', 'Strength', dataElbowFE.map(i => i.Date), dataElbowFE.map(i => i.Torque))
    ] : [
        createDataConfigWithHover('#435fe1', 'Horizontal Flexion/Extension', dataShoulderHFE.map(i => i.Date), dataShoulderHFE.map(i => i.Torque), 'square'),
        createDataConfigWithHover('#56C4DC', 'Internal/External Rotation', dataShoulderIE.map(i => i.Date), dataShoulderIE.map(i => i.Torque), 'diamond'),
        createDataConfigWithHover('#BDC7F3', 'Flexion/Extension', dataShoulderFE.map(i => i.Date), dataShoulderFE.map(i => i.Torque), 'circle')
    ];

    return (
        <LabeledGraph
            label={'Muscle Strength'}
            tip={`The strength graph shows the progress of how much support the patient required to perform the exercise over one week/one month/the entire period.`}
            classNameTip={'translate-y-[120px] -translate-x-2/3 z-50'}
            editInitialStrength={{
                strength: 0,
                variable: bodyPart === 'shoulder' ? "SHFE" : "EFE",
                date: getFormattedLocalDate(new Date()),
                bodyPart: bodyPart
            }}
        >
            <div className={`flex flex-col`}>
                <div className={`flex justify-start`}>
                    N⋅m
                </div>
                <LazyPlot
                    data={plotData}
                    layout={layout}
                    config={config}
                />
            </div>
        </LabeledGraph>
    );
};
