import {useState,FC} from "react";
import {Spasticity} from "../../../../store/rehybApi";
import {TimeSlider} from "./TimeSlider";
import {LazyPlot} from "../../../../common/graphs/LazyPlotly";
import {BodyPart} from "../Data";
import {LabeledGraph} from "./LabeledGraph";
import {getFormattedLocalDate} from "./ManualAssesmentButton";

const tip = "This graph presents a comprehensive view of the patient's spasticity over time. Each data point represents the combined effects of angle, speed, and torque, reflecting the severity and characteristics of spasticity at different times."
const config: Partial<Plotly.Config> = {
    displaylogo: false,
    displayModeBar: false,
    responsive: true
}

const layout: Partial<Plotly.Layout> = {
    height: 350,  // 设置高度
    width: 500,  // 设置宽度
    margin: {t: 0, b: 0, l: 0, r: 0},
    scene: {
        xaxis: {title: 'Angle (°)'},
        yaxis: {title: 'Speed'},
        zaxis: {title: 'Torque (N⋅m)'},
        camera: {
            up: {x: 0, y: 0, z: 1},
            center: {x: 0, y: 0, z: 0},
            eye: {x: 1.5, y: -2, z: 1.5},
        },
    },
    plot_bgcolor: 'rgba(255,255,255,0)',
    paper_bgcolor: 'rgba(255,255,255,0)',
    legend: {
        orientation: 'h',
    },
};

const sortData =
    (data: {
        Date: string,
        Assessment: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]
    }[]) => {
        //深度复制data,赋值给newData
        const newData: {
            Date: string,
            Assessment: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]
        }[] = JSON.parse(JSON.stringify(data));
        return newData.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
    }


const getSpasticityData =
    (spasticity: Spasticity,
     bodyPart: BodyPart,) => {
        if (bodyPart === 'shoulder') {
            return {
                dataShoulderFE: spasticity?.ShoulderFE ? sortData(spasticity.ShoulderFE) : [],
                dataShoulderHFE: spasticity?.ShoulderHFE ? sortData(spasticity.ShoulderHFE) : [],
                dataShoulderIE: spasticity?.ShoulderIE ? sortData(spasticity.ShoulderIE) : [],
            };
        } else if (bodyPart === 'elbow') {
            return {
                dataElbowFE: spasticity?.ElbowFE ? sortData(spasticity.ElbowFE) : [],
            };
        } else {
            return {};
        }
    };


function transformAssessment(Assessment: {
    Speed: string,
    Spasticity: { Angle: number, Torque: number }[]
}[] | undefined) {
    if (!Assessment) return [];
    return Assessment.flatMap(item => item.Spasticity.map(spasticity => ({
        Speed: item.Speed,
        Angle: spasticity.Angle,
        Torque: spasticity.Torque
    })));
}

export const SpasticityGraph: FC<{
    spasticity: Spasticity,
    bodyPart: BodyPart,
}> = ({spasticity, bodyPart}) => {
    const {
        dataShoulderFE = [],
        dataShoulderHFE = [],
        dataShoulderIE = [],
        dataElbowFE = []
    } = getSpasticityData(spasticity, bodyPart);

    const [selectedDate, setSelectedDate] = useState(0);

    if (bodyPart === 'elbow') {
        if (dataElbowFE.length > 0) {
            const currentAssessment = dataElbowFE[selectedDate]?.Assessment;
            // 将currentData中的数据转换为[{Speed: x, Angle: y, Torque: z}, ...]的形式
            const currentData = transformAssessment(currentAssessment);
            const plotData: Plotly.Data[] = [{
                x: currentData.map(item => item.Angle),
                y: currentData.map(item => item.Speed),
                z: currentData.map(item => item.Torque),
                type: 'scatter3d',
                mode: 'markers',
                name: 'Elbow',
                marker: {
                    size: 5,
                    symbol: 'circle'
                },
                hovertemplate: `<b>ElbowFE</b><br><b>Angle</b>: %{x} °<br><b>Speed</b>: %{y}<br><b>Torque</b>: %{z} N⋅m<extra></extra>`,
            }];

            const valueText = `${new Date(dataElbowFE[selectedDate].Date).toLocaleDateString()}`;
            return (
                <LabeledGraph
                    label={'Spasticity'}
                    tip={tip}
                    editInitialSpasticity={{
                        torque: 0,
                        angle: 0,
                        date: getFormattedLocalDate(new Date()),
                        speed:"Slow",
                        bodyPart: bodyPart,
                        variable: "EFE",
                    }}
                >
                    {currentData.length > 0 ? <LazyPlot data={plotData} layout={layout} config={config}/> :
                        <div className={`w-[500px] h-[350px]`}>No data available on this date</div>}
                    <TimeSlider
                        onChange={(newValue) => setSelectedDate(newValue)}
                        value={selectedDate}
                        max={dataElbowFE.length - 1}
                        valueText={valueText}
                    />

                </LabeledGraph>
            );

        } else {
            return <LabeledGraph
                label={'Spasticity'}
                tip={tip}
                editInitialSpasticity={{
                    torque: 0,
                    angle: 0,
                    date: getFormattedLocalDate(new Date()),
                    speed:"Slow",
                    bodyPart: bodyPart,
                    variable: "EFE",
                }}
            >
                <div className={`w-[500px] h-[350px]`}>No data of this body part available</div>
            </LabeledGraph>

        }

    } else if (bodyPart === 'shoulder') {
        if (dataShoulderFE.length === 0 && dataShoulderHFE.length === 0 && dataShoulderIE.length === 0) {
            return <LabeledGraph
                label={'Spasticity'}
                tip={tip}
                editInitialSpasticity={{
                    torque: 0,
                    angle: 0,
                    date: getFormattedLocalDate(new Date()),
                    speed:"Slow",
                    bodyPart: bodyPart,
                    variable: "SHFE",
                }}
            >
                <div className={`w-[500px] h-[350px]`}>No data of this body part available</div>
            </LabeledGraph>
        } else {
            //获得dataShoulderFE, dataShoulderHFE, dataShoulderIE中所有出现的日期，并排序
            const allDates = [...(dataShoulderFE || []),
                ...(dataShoulderHFE || []),
                ...(dataShoulderIE || [])].map(item => {
                const date = new Date(item.Date);
                date.setHours(0, 0, 0, 0);
                return date.toISOString();
            });
            allDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
            const uniqueDates = Array.from(new Set(allDates));

            // console.log({uniqueDates});//uniqueDates是所有出现的日期，并排序，去重,时间是当天0点0分0秒0毫秒

            function getAssessment(date: string, data: {
                Date: string,
                Assessment: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]
            }[]) {
                return data?.find(item => new Date(item.Date).setHours(0, 0, 0, 0) === new Date(date).getTime())?.Assessment;
            }

            const currentAssessmentFE = getAssessment(uniqueDates[selectedDate], dataShoulderFE);
            const currentAssessmentHFE = getAssessment(uniqueDates[selectedDate], dataShoulderHFE);
            const currentAssessmentIE = getAssessment(uniqueDates[selectedDate], dataShoulderIE);

            //经过上面的处理后，即使FE，HFE,IE中的数据时间不一致，也可以通过selectedDate来对齐，当天时间存在数据就显示，没有就是undefined
            const currentDataFE = transformAssessment(currentAssessmentFE);
            const currentDataHFE = transformAssessment(currentAssessmentHFE);
            const currentDataIE = transformAssessment(currentAssessmentIE);
            const plotData: Plotly.Data[] = [
                {
                    x: currentDataFE.map(item => item.Angle),
                    y: currentDataFE.map(item => item.Speed),
                    z: currentDataFE.map(item => item.Torque),
                    type: 'scatter3d',
                    mode: 'markers',
                    name: 'Flexion/Extension',
                    marker: {
                        size: 5,
                        opacity: 0.7,
                        symbol: 'circle',
                        color:'#BDC7F3'
                    },
                    hovertemplate: `<b>ShoulderFE</b><br><b>Angle</b>: %{x} °<br><b>Speed</b>: %{y}<br><b>Torque</b>: %{z} N⋅m<extra></extra>`,
                },
                {
                    x: currentDataHFE.map(item => item.Angle),
                    y: currentDataHFE.map(item => item.Speed),
                    z: currentDataHFE.map(item => item.Torque),
                    type: 'scatter3d',
                    mode: 'markers',
                    name: 'Horizontal Flexion/Extension',
                    marker: {
                        size: 5,
                        opacity: 0.7,
                        symbol: 'square',
                        color:'#435fe1'
                    },
                    hovertemplate: `<b>ShoulderHFE</b><br><b>Angle</b>: %{x} °<br><b>Speed</b>: %{y}<br><b>Torque</b>: %{z} N⋅m<extra></extra>`,
                },
                {
                    x: currentDataIE.map(item => item.Angle),
                    y: currentDataIE.map(item => item.Speed),
                    z: currentDataIE.map(item => item.Torque),
                    type: 'scatter3d',
                    mode: 'markers',
                    name: 'Internal/External Rotation',
                    marker: {
                        size: 5,
                        opacity: 0.7,
                        symbol: 'diamond',
                        color:'#56C4DC'
                    },
                    hovertemplate: `<b>ShoulderIE</b><br><b>Angle</b>: %{x} °<br><b>Speed</b>: %{y}<br><b>Torque</b>: %{z} N⋅m<extra></extra>`,
                }
            ];

            const valueText = `${new Date(uniqueDates[selectedDate]).toLocaleDateString()}`;

            return <LabeledGraph
                label={'Spasticity'}
                tip={tip}
                editInitialSpasticity={{
                    torque: 0,
                    angle: 0,
                    date: getFormattedLocalDate(new Date()),
                    speed:"Slow",
                    bodyPart: bodyPart,
                    variable: "SHFE",
                }}
            >
                {(currentDataFE.length === 0 && currentDataHFE.length === 0 && currentDataIE.length === 0) ?
                    <div className={`w-[500px] h-[350px]`}>No data available on this date</div> :
                    <LazyPlot data={plotData} layout={layout} config={config}/>}
                <TimeSlider
                    onChange={(newValue) => setSelectedDate(newValue)}
                    value={selectedDate}
                    max={uniqueDates.length - 1}
                    valueText={valueText}
                />
            </LabeledGraph>
        }
    } else {
        return <></>;
    }

}
