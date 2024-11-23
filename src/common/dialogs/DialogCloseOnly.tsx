import { ReactNode } from 'react'
import { TRANSITION_DURATION_opacity, useDisappearing_opacity } from './common_opacity'
import { AiOutlineClose } from 'react-icons/ai'
//用于显示页面之上的弹出信息框（z-40）
export const DialogCloseOnly = (props: {
    onClose: () => void,
    children: ReactNode,
    className?: string,
}) => {
    const [opacity, close] = useDisappearing_opacity(props.onClose)

    return <div className={`fixed top-0 left-0 w-full min-h-fit h-full bg-black bg-opacity-30 flex justify-center overflow-y-scroll
            transition-all z-40 min-w-fit`}
        style={{ transitionDuration: `${TRANSITION_DURATION_opacity}ms`, opacity: opacity }}
    >
        {/* transitionDuration 属性的作用是控制元素的过渡动画的持续时间，使页面元素的变化更加平滑和自然 */}
        <div
            className={`flex flex-col bg-white h-fit w-2/3 min-w-min p-6 rounded-2xl relative my-[7%] ${props.className}`}
            onClick={(e) => e.stopPropagation()}>
            {/* e.stopPropagation() 是一个事件对象的方法，用于阻止事件继续传播，
            即阻止事件从向上层元素传递。通常情况下，当在某个元素上触发了事件时，
            该事件会依次向上级元素传播，直到根元素或遇到了被阻止传播的情况为止。
            调用 e.stopPropagation() 可以阻止这种传播行为，使得事件只在当前元素上触发，不再向上级元素传递。 
            从而不会触发父元素上的 close 函数*/}
            <button
                className='btn-icon self-end absolute top-2 right-2 aspect-square'
                onClick={close}>
                <AiOutlineClose />
            </button>
            {props.children}
        </div>
    </div>
}