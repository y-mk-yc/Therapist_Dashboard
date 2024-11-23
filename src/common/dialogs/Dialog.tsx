import {ReactNode} from 'react'
import {TRANSITION_DURATION, useDisappearing} from './common'
import {AiOutlineClose} from 'react-icons/ai'

export const Dialog = (props: {
    onClose: () => void,
    children: ReactNode,
    className?: string,
    closeDisabled?: boolean
}) => {
    const [opacity, close] = useDisappearing(props.onClose)

    return <div className={`fixed top-0 left-0 w-full min-h-fit h-full bg-black bg-opacity-30 flex justify-center overflow-y-scroll
            transition-all z-40 min-w-fit`}
                style={{transitionDuration: `${TRANSITION_DURATION}ms`, opacity: opacity}}
                onClick={props.closeDisabled ? () => {} : close}
    >
        <div
            className={`flex flex-col bg-white h-fit w-2/3 min-w-min p-6 rounded-2xl relative my-[7%] ${props.className}`}
            onClick={(e) => e.stopPropagation()}>
            {!props.closeDisabled && <button
                className='btn-icon self-end absolute top-2 right-2 aspect-square'
                onClick={close}>
                <AiOutlineClose/>
            </button>}
            {props.children}
        </div>
    </div>
}