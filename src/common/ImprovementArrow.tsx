import {AiOutlineArrowDown, AiOutlineArrowUp} from 'react-icons/ai'
import {FC} from 'react'

export const ImprovementArrow: FC<{ direction: 'up' | 'down' | 'none' }> = ({direction}) => {
    const arrows = {
        'up': <AiOutlineArrowUp className={'fill-positive'}/>,
        'down': <AiOutlineArrowDown className={'fill-negative'}/>,
        'none': <div className={'w-8'}/>,
    }

    return arrows[direction]
}