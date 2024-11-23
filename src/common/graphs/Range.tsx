import {CSSProperties, FC} from 'react'


export const Range: FC<{ data: { from: number, to: number, max: number, min: number }, unit?: string, indicatorClassName: string }> =
    ({
         data: {
             from,
             to,
             max,
             min
         },
         unit,
         indicatorClassName
     }) => {
        const total = max - min;
        const startPrctg = ((from - min) / total) * 100
        const widthPrctg = ((to - from) / total) * 100

        return <div className={'relative h-8'}>
            <Indicator
                indicatorClassName={indicatorClassName}
                type={'background'}
                style={{}}
            />
            <Indicator
                indicatorClassName={indicatorClassName}
                type={'foreground'}
                style={{left: `${startPrctg}%`, width: `${widthPrctg}%`}}
                labels={{from: from.toString() + (unit ? ' ' + unit : ''), to: to.toString() + (unit ? ' ' + unit : '')}}
            />
        </div>
    }

const Indicator = (props: {
    type: 'background' | 'foreground',
    style: CSSProperties,
    indicatorClassName: string,
    labels?: { from?: string, to?: string }
}) => {
    const border = props.type == 'background' ? 'border-secondary2' : 'border-positive'
    const circleBg = props.type == 'background' ? 'bg-secondary2' : 'bg-positive'

    const fromForegroundLabel = props.labels?.from ? {value: props.labels?.from, highlight: false} : undefined
    const toForegroundLabel = props.labels?.to ? {value: props.labels?.to, highlight: false} : undefined

    return <div className={`flex items-center w-full gap-1 absolute top-0 bottom-0 left-0 right-0 ${props.indicatorClassName}`}
                style={props.style}>
        <Circle color={circleBg} label={fromForegroundLabel}/>
        <div className={`border-t-4 border-dotted flex-1 h-fit ${border}`}/>
        <Circle color={circleBg} label={toForegroundLabel}/>
    </div>
}

const Circle = (props: { color: string, label?: { value: string, highlight: boolean } }) => {
    const textColor = props.label?.highlight ? 'text-text-dark' : 'text-text-light'
    return <div className={`w-4 h-4 aspect-square rounded-full ${props.color} relative`}>
        {props.label &&
            <span className={`absolute top-4 -left-6 font-bold ${textColor} text-sm w-16 text-center`}>{props.label?.value}</span>}
    </div>
}

