import {ReactNode} from 'react'

export const divWrapper = (baseStyle: string) => {
    return (props: {children: ReactNode, className?: string}) => {
        return <div className={`${baseStyle} ${props.className}`}>
            {props.children}
        </div>
    }
}

// 创建一个具有一些基础样式的div包装器
// const StyledDiv = divWrapper('base-styles');
//
// // 使用StyledDiv组件，并传入额外的样式和内容
// const MyComponent = () => {
//     return (
//         <StyledDiv className="additional-styles">
//             <p>This is some content inside the styled div.</p>
//         </StyledDiv>
//     );
// };
// 这个高阶组件工厂的用途是创建一个可复用的div包装器，它允许你为多个组件提供一个共同的基础样式，
// 同时还能够接受额外的样式类名和子元素。这样，你可以轻松地创建具有一致样式的div元素，而不必在每个组件中重复相同的样式代码。