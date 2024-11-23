import {FC} from "react";

export const Checkbox: FC<{onValueSet: (value: boolean) => void, value: boolean}> = ({onValueSet, value}) => {
    return <div className={'rounded w-32 h-8 bg-secondary cursor-pointer overflow-hidden shadow-inner'}>
        <div className={`h-full w-1/2 bg ${value ? 'bg-positive' : 'bg-negative'} text-white text-center align-middle flex items-center justify-center shadow`}>
            {value ? 'Yes' : 'No'}
        </div>
    </div>
}