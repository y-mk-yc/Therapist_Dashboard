import {FC} from "react";
import {LazyPlot} from "./LazyPlotly";

const createLineData: (data: number[]) => Plotly.Data[] = (data) => [{
    y: data,
    line: {
        color: '#435fe1'
    },
    domain: {column: 0},
    type: 'scatter',
    mode: 'lines',
    textinfo: 'none',
    fill: 'tonexty',
}]

const createLineDataPatientMood: (data: (number | null)[], dates: string[]) => Plotly.Data[] = (data, dates) => [{
    x: dates, // 添加日期数据作为 x 轴
    y: data,
    line: {
        color: '#435fe1'
    },
    domain: {column: 0},
    type: 'scatter',
    mode: 'lines+markers',
    textinfo: 'none',
    fill: 'tonexty',
    marker: {
        size: 8,
        color: data.map(value => {
            if (value === null) return undefined;
            if (value > 0) {
                return '#74e03e'; // 大于 0 使用绿色
            } else if (value < 0) {
                return '#DD5505'; // 小于 0 使用红色
            } else {
                return '#e0ca3e'; // 等于 0 使用黄色
            }
        }),
        line: {
            width: 0
        }
    }
}]

const createLineLayoutPatientMood: (width: number, height: number) => Partial<Plotly.Layout> = (width, height) => ({
    showlegend: false,
    height,
    width,
    margin: {t: 0, b: 15, l: 20, r: 16},
    paper_bgcolor: 'rgba(255,255,255,0)',
    plot_bgcolor: 'rgba(255,255,255,0)',
    font: {
        size: 8
    },
    xaxis: {
        showgrid: true,
        tickformat: '%b %d',
        tickfont: {
            size: 9
        }
    },
    yaxis: {
        showgrid: true,
        tickvals: [1, 0, -1],
        range: [-1.05, 1.08] // 设置 y 轴范围
    }
});

const createLineLayout: (width: number, height: number) => Partial<Plotly.Layout> = (width, height) => ({
    showlegend: false,
    height,
    width,
    margin: {t: 0, b: 10, l: 20, r: 16},
    paper_bgcolor: 'rgba(255,255,255,0)',
    plot_bgcolor: 'rgba(255,255,255,0)',
    font: {
        size: 8
    },
    xaxis: {
        showgrid: false
    },
    yaxis: {
        showgrid: false
    }
})

const config: Partial<Plotly.Config> = {
    staticPlot: true,
}

export const SimplePlotlyLineGraph: FC<{
    data: number[],
    width: number,
    height: number,
    title?: string
}> = ({data, width, height, title}) => {
    return <div>
        {title && <h6 className={'font-normal'}>{title}</h6>}
        <LazyPlot
            data={createLineData(data)}
            layout={createLineLayout(width, height)}
            config={config}
        />
    </div>
}

export const SimplePlotlyLineGraphPatientMood: FC<{
    data: (number | null)[],
    dates: string[],
    width: number,
    height: number
}> = ({data, dates, width, height}) => {
    return <div>
        <LazyPlot
            data={createLineDataPatientMood(data, dates)}
            layout={createLineLayoutPatientMood(width, height)}
            config={config}
        />
    </div>
}