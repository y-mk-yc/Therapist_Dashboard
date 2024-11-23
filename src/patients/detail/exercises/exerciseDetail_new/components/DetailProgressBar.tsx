import React, { useState, useEffect } from 'react';

interface DetailProgressBarProps {
    currentMovementIndex: number;
    movements_TValues: number[];
    width: number; // 添加 width 到 props 类型定义中
    left: number;
}

export const DetailProgressBar: React.FC<DetailProgressBarProps> = ({ currentMovementIndex, movements_TValues, width, left }) => {
    const [indicatorPosition, setIndicatorPosition] = useState(0);



    useEffect(() => {
        if (movements_TValues.length > 1) {
            const newPosition = (currentMovementIndex / (movements_TValues.length - 1)) * 100;
            setIndicatorPosition(newPosition);
        } else {
            // 对于长度为1的情况，可以默认为0%或100%，或者其他逻辑
            setIndicatorPosition(0); // 假设放在开始位置
        }
        console.log('DetailProgressBar: ', currentMovementIndex);
    }, [currentMovementIndex, movements_TValues]);




    return (
        <div className="relative h-10 bg-gray-200" style={{ width: `${width}px`, marginLeft: `${left}px`, zIndex: 0 }}>
            <div
                className="absolute bg-black h-full w-1"
                style={{
                    left: `${indicatorPosition}%`,
                    zIndex: 1000,
                    pointerEvents: 'none'
                }}
            />
        </div>
    );
};
