import React, { useState, useEffect } from 'react';
import { Range, getTrackBackground } from 'react-range';
import { CompensationType_COLORS } from '../TypeColors';

interface FrameRangeSliderProps {
  step: number;
  min: number;
  max: number;
  values: number[];
  setValues: React.Dispatch<React.SetStateAction<number[]>>;
  currentFrame: number;
}

export const FrameRangeSlider: React.FC<FrameRangeSliderProps> = ({ step, min, max, values, setValues, currentFrame }) => {

  const [currentFramePosition, setCurrentFramePosition] = useState(0);

  useEffect(() => {
    const totalRange = max - min;
    const selectedRange = values[1] - values[0];
    let positionWithinRange = 0;
    if (selectedRange > 0) {
      positionWithinRange = ((currentFrame - values[0]) / selectedRange) * 100;
    }

    const startPosition = ((values[0] - min) / totalRange) * 100;
    const endPosition = ((values[1] - min) / totalRange) * 100;
    const position = startPosition + (positionWithinRange * (endPosition - startPosition) / 100);
    setCurrentFramePosition(position);
  }, [currentFrame, min, max]);


  return (
    <div className="flex flex-col justify-center h-10 w-full">
      <div className='h-10 w-full'>
        <Range
          step={step}
          min={min}
          max={max}
          values={values}
          onChange={(newValues) => {
            setValues(newValues);
          }}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="h-10 w-full relative cursor-pointer"
              style={{
                touchAction: 'none',
                background: getTrackBackground({
                  values: values,
                  colors: [CompensationType_COLORS['Healthy'].color, CompensationType_COLORS['CurrentlySelected'].color, CompensationType_COLORS['Healthy'].color],
                  min: min,
                  max: max
                }),
              }}
            >

              <div
                className="w-1 bg-red-500 absolute"
                style={{
                  height: '120%',
                  left: `${currentFramePosition}%`,
                  top: '-10%',
                  zIndex: 2,
                  pointerEvents: 'none'
                }}
              />


              {children}
            </div>
          )}
          renderThumb={({ props, isDragged }) => (
            <div
              {...props}
              className="h-10 w-1 bg-black absolute shadow cursor-pointer"
              style={{
                ...props.style,
                touchAction: 'none',
                zIndex: 1,
              }}
            >
            </div>
          )}
        />
      </div>
      <div className="mt-1 text-center">
        Currently Selected: {values[0]} - {values[1]}
      </div>
    </div>
  );
};
