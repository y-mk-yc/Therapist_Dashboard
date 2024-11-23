import {getTrackBackground, Range} from 'react-range';

export const DoubleRangeSlider = (
    props: {
        minMax: [number, number],
        values: [number, number],
        setValues: (newValues: [number, number]) => void
    }
) => {
    const {values, minMax, setValues} = props

    return <div className={'flex'}>
        <span className={'w-24 text-center'}>{values[0]}</span>
        <Range
        values={values}
        step={1}
        min={minMax[0]}
        max={minMax[1]}
        onChange={(values) => {
            setValues(values as [number, number]);
        }}
        renderTrack={({props, children}) => (
            <div
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                style={{
                    ...props.style,
                    height: '32px',
                    display: 'flex',
                    width: '100%'
                }}
            >
                <div
                    ref={props.ref}
                    style={{
                        height: '8px',
                        width: '100%',
                        borderRadius: '4px',
                        background: getTrackBackground({
                            values,
                            colors: ['#eeeeee', '#548BF4', '#eeeeee'],
                            min: minMax[0],
                            max: minMax[1]
                        }),
                        alignSelf: 'center'
                    }}
                >
                    {children}
                </div>
            </div>
        )}
        renderThumb={({props, isDragged}) => (
            <div
                {...props}
                style={{
                    ...props.style,
                    height: '20px',
                    width: '20px',
                    borderRadius: '100%',
                    backgroundColor: '#548BF4',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0px 2px 6px #AAA'
                }}
            >
            </div>
        )}
        />
        <span className={'w-24 text-center'}>{values[1]}</span>
    </div>
}