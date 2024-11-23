import {useEffect, useState} from 'react'

export const TRANSITION_DURATION = 300  //动画持续时间,单位为毫秒
// TODO onDone values
export const useDisappearing = (onDone: () => void): [number, typeof onDone] => {
    //opacity为0表示完全透明，即不可见；为100表示完全不透明，即可见
    const [opacity, setOpacity] = useState(0)
    useEffect(() => {
        setOpacity(100)
    }, [])  //当组件挂载的时候，设置opacity为100，即可见，目的是让组件显示出来

    const close = async () => { //点击关闭按钮的时候，先将opacity值设置为0，即不可见，然后停顿300ms，然后调用onDone函数，即300ms后组件消失
        setOpacity(0)
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(null)
            }, TRANSITION_DURATION)
        })
        onDone()
    }

    return [opacity, close]
}
