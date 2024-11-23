export const Chip = (props: { color?: string, className?: string }) => {
    return <div className={`h-3 w-6 rounded inline-block ${props.className}`} style={{background: props.color}}/>
}