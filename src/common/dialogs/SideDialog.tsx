import {ReactNode, useEffect, useState} from 'react'
import {TRANSITION_DURATION, useDisappearing} from './common'

export const SideDialog = (props: {
    title: string,
    subtitle?: string,
    onClose: () => void,
    showCancelButton: boolean,
    primaryAction?: () => void,
    children: ReactNode,
    actionLabel?: string,
    isActionDisabled?: boolean
}) => {
    const [opacity, close] = useDisappearing(props.onClose)

    return <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-end overflow-y-scroll
            transition-all z-40`} //z-40表示这个对话框在较高层，防止某些图片将其遮挡
                style={{transitionDuration: `${TRANSITION_DURATION}ms`, opacity: opacity}}
                onClick={close}
                //这个div是背景，即添加病人对话框左边的灰色背景，从视觉的角度看是为了突出对话框，并且让原Patients页面变暗且不可点击
    >
        <div className='flex flex-col bg-white w-1/3 h-max min-h-full min-w-fit p-6 ' onClick={(e) => e.stopPropagation()}>
            <h2>{props.title}</h2>
            {props.subtitle && <h4 className='leading-10 mb-1'>{props.subtitle}</h4>}   {/*如果props.subtitle存在，就显示props.subtitle*/}
            {props.children}
            {/*表示DialogNewPatient.tsx中的<NewPatient />或者<ExistingPatient />*/}
            <div className='flex justify-end gap-4 py-4'>
                {props.showCancelButton && <button className='btn-secondary' onClick={close}>Cancel</button>}
                {/*这个Cancel在Create 按钮的下面,不是左边的Cancel，左边的Cancel和右边的Create属于NewPatient组件*/}
                {props.primaryAction && <button className='btn-primary px-8' onClick={props.primaryAction} disabled={props.isActionDisabled ?? false}>{props.actionLabel??'Save'}</button>}
                {/*因为props.primaryAction为undefined，所以这个Save在NewPatient组件中是不显示的*/}
            </div>
        </div>
    </div>
}