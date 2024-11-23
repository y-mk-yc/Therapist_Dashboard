import {ReactNode} from 'react'
import {TRANSITION_DURATION, useDisappearing} from './common'
import {AiOutlineClose} from 'react-icons/ai'

export const TinyDialog = (props: { children: ReactNode, onClose: () => void }) => {
    const [opacity, close] = useDisappearing(props.onClose)

    return <>
        <div className={'fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-30 z-10 cursor-default'} //Edit Patient对话框的灰色背景
             onClick={(e) => {
                 e.stopPropagation()
                 close() //点击灰色背景的时候，关闭对话框
             }}
             style={{transitionDuration: `${TRANSITION_DURATION}ms`, opacity: opacity}} //300ms出现或消失
        />
        <div className='bg-white rounded shadow-xl absolute -top-10 right-10 p-4 flex flex-col z-10'
             style={{transitionDuration: `${TRANSITION_DURATION}ms`, opacity: opacity}}
             onClick={(e) => {
                 e.stopPropagation()
             }}
        >
            <button
                className='self-end absolute top-2 right-2 cursor-default rounded-full hover:bg-gray-200 transition-colors duration-200'  //关闭按钮
                onClick={close}
            >
                <AiOutlineClose className={'fill-primary w-4 h-4 m-1'}/>
            </button>
            {props.children}
        </div>
    </>
}

//这是点击三点按钮后出现的页面，包含灰色背景和小白色对话框，小白色对话框中包含X关闭按钮，
// (Edit Patient按钮，Archive Patient按钮和Delete Patient按钮)由props.children传入