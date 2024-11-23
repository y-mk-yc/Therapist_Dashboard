type Item = { name: string, value: any }
export const FancySwitch = (props: {
    left: Item
    right: Item
    active: Item
    onChange: (newItem: Item) => void
}) => {
    return <div className={'flex bg-primary rounded-full text-white flex-0 w-fit shadow'}>
        <SwitchButton active={props.left.value == props.active.value} text={props.left.name} onClick={() => {props.onChange(props.left)}}/>
        <SwitchButton active={props.right.value == props.active.value} text={props.right.name} onClick={() => {props.onChange(props.right)}}/>
    </div>
}

const SwitchButton = (props: { active: boolean, text: string, onClick: () => void }) => {
    const style = props.active ? 'bg-white text-primary z-10' : 'bg-primary text-white z-0'

    return <button className={`transition-all duration-200 rounded-full px-3 py-2 ${style}`} onClick={props.onClick}>
        {props.text}
    </button>
}


