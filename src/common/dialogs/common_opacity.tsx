import { useEffect, useState } from 'react'

export const TRANSITION_DURATION_opacity = 300
// TODO onDone values
export const useDisappearing_opacity = (onDone: () => void): [number, typeof onDone] => {
    const [opacity, setOpacity] = useState(0)
    useEffect(() => {
        setOpacity(1)
    }, [])

    const close = async () => {
        setOpacity(0)
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(null)
            }, TRANSITION_DURATION_opacity)
        })
        onDone()
    }

    return [opacity, close]
}
