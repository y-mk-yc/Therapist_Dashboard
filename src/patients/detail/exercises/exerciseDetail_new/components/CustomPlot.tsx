import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { PlotData, Layout } from 'plotly.js';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";



interface CustomPlotProps {
    title: string;
    data: Partial<PlotData>[];
    layout: Partial<Layout>;
    showCover: boolean;
    coverPosition: number;
    coverWidth: number;
    coverLeft: number;
}

export const CustomPlot: React.FC<CustomPlotProps> = ({ title, data, layout, showCover, coverPosition, coverWidth, coverLeft }) => {



    // 初始时设置图例和工具箱可见
    const [showControls, setShowControls] = useState(true);


    // 调整 layout 来显示或隐藏图例和模式栏
    const adjustedLayout = {
        ...layout,
        title,
        showlegend: showControls
    };


    // 创建配置对象以控制工具栏的显示
    const config = {
        displayModeBar: false, // 不需要根据 showControls 状态显示或隐藏工具栏
    };



    // 切换控制显示
    const toggleControls = () => {
        setShowControls(!showControls);
    };




    return (

        <div className="flex items-start justify-between">

            <div className='relative'>
                <Plot
                    data={data}
                    layout={adjustedLayout}
                    config={config}
                    style={{ width: '100%', height: '100%' }}
                />

                {/* 不要删掉，留着备用 */}
                {/* {showCover && (

                    <div
                        style={{
                            position: 'absolute',
                            marginLeft: `${coverLeft}px`,  // 这里设置marginLeft，将其与progressBar对齐
                            top: 22,
                            width: `${coverWidth}px`,  // 调整宽度以考虑边距
                            height: '75%'
                        }}
                    >


                        <div
                            style={{
                                position: 'absolute',
                                left: `${coverPosition}%`,
                                top: 0,
                                width: `${100 - coverPosition}%`,
                                height: '100%',
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                pointerEvents: 'none'  // 确保遮罩不会阻止图表的交互
                            }}
                        />
                    </div>
                )} */}



            </div>




            <div className="mr-auto mt-10 bg-gray-500 rounded-md">
                {showControls ?
                    <AiFillEyeInvisible size={24} onClick={toggleControls} style={{ cursor: 'pointer' }} /> :
                    <AiFillEye size={24} onClick={toggleControls} style={{ cursor: 'pointer' }}
                    />}
            </div>



        </div>


    );
};
