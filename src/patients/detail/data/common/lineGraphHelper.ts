export const createDataConfig = (color: string, name: string, x: (number | string)[], y: number[]): Plotly.Data => {
    return {
        line: {
            color: color
        },
        type: 'scatter',
        textinfo: 'none',
        y,
        x,
        name: name
    }
}
export const createAnnotation = (axis: 'X' | 'Y', text: string) => {
    return {
        xref: 'paper',
        yref: 'paper',
        x: axis == 'X' ? 1 : 0,
        xanchor: axis == 'X' ? 'right' : 'left',
        y: axis == 'X' ? 0 : 1,
        yanchor: axis == 'X' ? 'bottom' : 'middle',
        text: text,
        showarrow: false
    } as Plotly.Annotations
}

export const createLineLayout = (xLabel: string, yLabel: string): Partial<Plotly.Layout> => ({
    height: 180,
    margin: {t: 16, b: 48, l: 0, r: 0},
    plot_bgcolor: 'rgba(255,255,255,0)',
    paper_bgcolor: 'rgba(255,255,255,0)',
    legend: {
        orientation: 'h',
    },
    annotations: [
        createAnnotation('Y', yLabel),
        createAnnotation('X', xLabel)
    ],
})

export const config: Partial<Plotly.Config> = {
    displaylogo: false,
    displayModeBar: false,
    responsive: true
}