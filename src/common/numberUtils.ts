export const roundToNearestX = (num: number, x: number): string => {
    return (Math.round(num / x) * x).toFixed(2)
}