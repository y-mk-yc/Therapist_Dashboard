import * as R from 'rambda'

export const Progress = (props: {
    min: number,
    max: number,
    progress: number,
    indicatorClassName: string
}) => {
    const labels = R.range(props.min, props.max + 1)
    const progressPerc = ((props.progress - props.min) / (props.max - props.min)) * 100

    return <div className={'flex flex-col w-96 gap-1 pb-6'}>
        <div className={'flex justify-between w-full'}>
            {labels.map(label => <span>{label}</span>)}
        </div>
        <div className={'flex bg-secondary h-4 w-full rounded-full'}>
            <div className={`h-full relative rounded-full ${props.indicatorClassName}`} style={{width: `${progressPerc}%`}}>
                <span className={'absolute -right-2 -bottom-7 z-50'}>{props.progress}</span>
            </div>
        </div>
    </div>
}