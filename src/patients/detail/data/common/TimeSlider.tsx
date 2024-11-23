import React, {FC} from "react";

export const TimeSlider: FC<{ onChange: (newValue: number) => void, value: number, max: number, valueText: string }> = (
    {
        onChange,
        value,
        max,
        valueText
    }) => {
    return <div className={'flex items-center gap-4 w-full text-text font-bold whitespace-nowrap'}><
        input type={'range'} step={1} min={0} max={max} className={'px-0 flex-1 max-w-full appearance-none bg-tertiary p-0'}
              onChange={(e) => onChange(+e.target.value)}
              value={value}
    />
        {valueText}
    </div>
}