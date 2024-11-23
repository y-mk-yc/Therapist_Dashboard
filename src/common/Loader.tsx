import './LoaderStyle.css'
import {CSSProperties} from 'react'

export const Loader = (props: {style?: CSSProperties}) => {
    return <div className="lds-ripple self-center" style={props.style}>
        <div></div>
        <div></div>
    </div>
}

//这个组件是一个加载动画，用来在加载数据的时候显示。它接受一个style属性，用来设置它的样式。它的样式是一个圆圈，圆圈里面有两个小圆圈，这两个小圆圈会不停的旋转。