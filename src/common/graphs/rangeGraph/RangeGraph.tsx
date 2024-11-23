import {FC} from "react";

export type RangeData = {
    Min: number,
    Max: number,
    Date: string,
}[]
const formatDate = (date: Date, showYear?: boolean) => {
    const formattedDate = date.toLocaleDateString('en-US', {month: 'short', day: '2-digit'});
    const [month, day] = formattedDate.split(' ');
    if (showYear) {
        return `${month}-${day}-${date.getFullYear()}`;
    }
    return `${month}-${day}`;
}
const generateDateNoData = (period: 'Week' | 'Month' | 'AllTime') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateNoData = Array.from({length: 7}, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        return date.toISOString();
    }).reverse();

    if (period === 'Month') {
        dateNoData[0] = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29).toISOString();
        dateNoData[3] = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15).toISOString();
        dateNoData[6] = today.toISOString();
    } else if (period === 'AllTime') {
        dateNoData[0] = new Date(2020, 0, 1).toISOString();
    }
    return dateNoData;
};

export const RangeGraph = (props: {
    data: RangeData,
    onDataHover: (dato: Omit<RangeData[number], 'Date'>) => void,
    onHoverLeft: () => void,
    period: 'Week' | 'Month' | 'AllTime'
}) => {
    //获得提供的数据中的最小值和最大值
    let last7daysData: ({ Max: number | undefined, Min: number | undefined, Date: string | undefined }[]) = [];
    let oneMonthData: ({ Max: number | undefined, Min: number | undefined, Date: string | undefined }[]) = [];
    let allTimeData: ({ Max: number | undefined, Min: number | undefined, Date: string | undefined }[]) = [];
    let showYear = false;
    if (props.period === 'Week') {
        //检查props.data中的数据是否是连续一周的，如果不是，将缺失的日期补上，Min和Max都设置为undefined
        const last7days = generateDateNoData('Week');
        last7daysData = last7days.map((date) => {
            const found = props.data.find(data => {
                const dataDate = new Date(data.Date);
                dataDate.setHours(0, 0, 0, 0);
                return dataDate.toISOString() === date;
            });
            if (found) {
                return {Min: found.Min, Max: found.Max, Date: date};
            } else {
                return {Min: undefined, Max: undefined, Date: date};
            }
        });

    } else if (props.period === 'Month') {
        oneMonthData = [...props.data];
        const XaxisDate = generateDateNoData('Month');
        if (props.data.length < 7) {
            //给oneMonthData添加数据,使长度为7，Min和Max,Date都设置为undefined
            for (let i = 0; i < 7 - props.data.length; i++) {
                oneMonthData.push({Min: undefined, Max: undefined, Date: undefined});
            }
        }
        //如果oneMonthData中全是{Min: undefined, Max: undefined, Date: undefined}，那么将XaxisDate中下表0，3，6的Date赋值给oneMonthData中下标0，3，6的Date
        if (oneMonthData.every((data) => data.Min === undefined && data.Max === undefined && data.Date === undefined)) {
            oneMonthData[0].Date = XaxisDate[0];
            oneMonthData[3].Date = XaxisDate[3];
            oneMonthData[6].Date = XaxisDate[6];
        }

    } else {
        allTimeData = [...props.data];
        if (props.data.length < 7) {
            //给allTimeData添加数据,使长度为7，Min和Max,Date都设置为undefined
            for (let i = 0; i < 7 - props.data.length; i++) {
                allTimeData.push({Min: undefined, Max: undefined, Date: undefined});
            }
        }
        const XaxisDate = generateDateNoData('AllTime');
        //如果allTimeData中全是{Min: undefined, Max: undefined, Date: undefined}，那么将XaxisDate中下表0,6的Date赋值给allTimeData中下标0,6的Date
        if (allTimeData.every((data) => data.Min === undefined && data.Max === undefined && data.Date === undefined)) {
            allTimeData[0].Date = XaxisDate[0];
            allTimeData[6].Date = XaxisDate[6];
            showYear = true;
        }
    }
    const min = props.data.reduce((acc, value) => {
        return value.Min < acc ? value.Min : acc
    }, 500);
    const max = props.data.reduce((acc, value) => {
        return value.Max > acc ? value.Max : acc
    }, -500);

    // const periodNoData = generateDateNoData(props.period);

    const RESOLUTION = 20; //y轴的分辨率,每20度一个刻度
    const rangeLength = props.data.length > 0 ? (max - min) : 100; //x轴上某个值的最大值和最小值的差值
    // const rangeLengthNoData = 100; //没有数据时的y轴的长度

    //labels 是从max 开始，每次减去resolution，直到最后一个数比min小或者相等结束
    function createLabels(min: number, max: number, resolution: number) {
        let labels = [];
        for (let i = max; i > min - resolution; i -= resolution) {
            labels.push(i);
        }
        return labels;
    }

    const labels = props.data.length > 0 ? createLabels(min, max, RESOLUTION) : createLabels(0, 100, RESOLUTION);
    // const labelsNoData = createLabels(0, 100, RESOLUTION);
    const columnsNumber = props.period === 'Week' ? last7daysData.length + 1 :
        props.period === 'Month' ? oneMonthData.length + 1 :
            allTimeData.length + 1;
    const BottomLabelsData = props.period === 'Week' ? last7daysData :
        props.period === 'Month' ? oneMonthData :
            allTimeData;

    const columnWidth = (props.period === 'Week' || BottomLabelsData.length <= 7) ? '60px' : '1fr';

    // console.log("BottomLabelsData", BottomLabelsData);
    return <div className={'grid'}
                style={{
                    alignItems: 'stretch', //设置交叉轴的对齐方式为stretch，表示占满整个单元格，这里交叉轴是y轴
                    gridTemplateColumns: `repeat(${columnsNumber}, ${columnWidth})`, //创建一个列数为props.data.length+1的网格，每一列的宽度为1fr
                    gridTemplateRows: `repeat(${rangeLength},2px)`  //创建一个行数为rangeLength+2的网格，每一行的高度为2px
                }}
                onMouseLeave={props.onHoverLeft}
    >
        {/* Bottom labels */}
        {BottomLabelsData.map((dato, idx) =>
            <span
                key={idx}
                className={'text-sm border-t border-text-light text-center pt-2 z-10'}
                style={{
                    gridColumn: idx + 2,  //如果idx=0，那么gridColumn的值为2，这里就是第2列，因为列数和行数都是从1开始的，而第一列是y轴的刻度标签
                    gridRow: (labels[0] - labels[labels.length - 1]) + 1  //gridRow的值为labels.length*RESOLUTION-1，这里是6*20-1=119行，
                }}>
                {
                    BottomLabelsData.length <= 7 ?
                        (dato.Date === undefined ? '' : formatDate(new Date(dato.Date), (props.period === 'AllTime') && showYear)) :
                        (
                            (idx === 0 || idx === BottomLabelsData.length - 1) &&
                            (dato.Date === undefined ? '' : formatDate(new Date(dato.Date), (props.period === 'AllTime') && showYear))
                        )
                }
            </span>)

        }
        {/* Left labels */}
        {labels.map((label, idx) =>
            <div
                key={idx}
                className={`text-sm text-center border-r pr-2 border-r-text-light ${idx == labels.length - 1 ? 'border-r-0' : ''}`}
                //如果idx=labels.length-1，那么border-r-0，否则border-r，即x轴标签的右边没有实线
                style={{gridColumn: 1, gridRowStart: (idx) * RESOLUTION + 1, gridRowEnd: (idx + 1) * RESOLUTION + 1}}
                //列数都是1，行数以idx=1为例，gridRowStart=1*20+1=21，gridRowEnd=2*20+1=41，即第21行到第41行
            >
                <span className={'relative -top-3'}>{parseFloat(label.toFixed(1))}</span> {/*防止出现无限浮点数*/}
            </div>
        )}
        {/* Guidelines */}
        {labels.map((_, idx) => <HorizontalDivider key={idx} columnStart={2} columnEnd={-1}
                                                   row={idx * RESOLUTION + 1}/>)}
        {/* Data */}
        {BottomLabelsData.map((dato, idx) =>
            dato.Max !== undefined && dato.Min !== undefined && dato.Date !== undefined &&
            <VerticalLine
                key={idx}
                onHover={() => props.onDataHover({Min: dato.Min!, Max: dato.Max!})}
                MaxInData={max}
                Min={dato.Min}
                Max={dato.Max}
                Date={dato.Date}
                column={idx + 2}/>
        )}
    </div>
}

const HorizontalDivider: FC<{ columnStart: number, columnEnd: number, row: number }> =
    ({
         columnStart,
         columnEnd,
         row
     }) => {
        return <div
            className={'border-t border-dotted h-[2px] border-secondary'}
            style={{
                gridColumnStart: columnStart,
                gridColumnEnd: columnEnd,
                gridRowStart: row
            }}>
        </div>
    }

const VerticalLine: FC<{
    Min: number,
    Max: number,
    column: number,
    MaxInData: number,
    onHover: () => void,
    Date: string
}> = (props) => {
    const circle = <div className={'relative'}>
        <svg height="10" width="10">
            <circle cx="5" cy="5" r="5" className={'fill-primary'}/>
        </svg>
    </div>
    //画布的宽度是10，高度是10，圆心坐标是(5,5)，半径是5，填充颜色是primary
    // console.log("range of motion",props);
    // console.log(`${props.MaxInData - props.Max + 1} / span ${props.Max - props.Min}`);

    const labelStyle = `bg-white rounded px-1 absolute z-20 opacity-0 group-hover:opacity-100 transition`

    // if (props.Max === props.Min) {
    //     return <div
    //         className='hover:bg-secondary rounded-full relative group'
    //         style={{
    //             gridRow: `${Math.round(props.MaxInData - props.Max + 1)}`,
    //             gridColumn: props.column,
    //             justifySelf: 'stretch',
    //         }}
    //         onMouseEnter={props.onHover}
    //     >
    //         {circle} {/*上端点*/}
    //         <div className={'w-[2px] bg-secondary2 flex-1 relative'}>
    //             <div className={`${labelStyle} -top-9 -left-3`}> {/*上端点的标签*/}
    //                 {parseFloat(props.Max.toFixed(1)) + '°'}
    //             </div>
    //             <div className={`absolute inset-0 flex justify-center items-center`}>
    //                 <div className={labelStyle}> {/*中间的时间标签*/}
    //                     {new Date(props.Date).toLocaleDateString()}
    //                 </div>
    //             </div>
    //             <div className={`${labelStyle} -bottom-9 -left-3`}> {/*下端点的标签*/}
    //                 {parseFloat(props.Min.toFixed(1))+ '°'}
    //             </div>
    //         </div>
    //
    //     </div>
    // }

    return <div
        className='flex flex-col justify-around items-center justify-self-center hover:bg-secondary rounded-full relative group'
        //flex-col表示主轴是垂直方向，交叉轴是水平方向，justify-around表示主轴上的元素均匀分布在行中，items-center表示交叉轴上的元素居中对齐
        //justify-self-center表示使元素自身在父grid容器中居中对齐,hover:bg-secondary表示鼠标悬停时背景色变为secondary
        // rounded-full表示元素呈现圆形或椭圆形，具体取决于元素的宽高比,relative表示相对定位，group表示元素的子元素可以使用group-hover
        style={{
            gridRow: `${Math.round(props.MaxInData - props.Max + 1)} / span ${Math.max(1, Math.round(props.Max - props.Min))}`,
            gridColumn: props.column,
            //grid-area: <row-start> / <column-start> / <row-end> / <column-end>;
            //grid-column属性是grid-column-start和grid-column-end的合并简写形式，grid-row属性是grid-row-start属性和grid-row-end的合并简写形式。
            justifySelf: 'stretch',
        }}
        onMouseEnter={props.onHover}
    >
        {circle} {/*上端点*/}
        <div className={'w-[2px] bg-secondary2 flex-1 relative'}>
            <div className={`${labelStyle} -top-9 -left-3`}> {/*上端点的标签*/}
                {parseFloat(props.Max.toFixed(1)) + '°'}
            </div>
            <div className={`absolute inset-0 flex justify-center items-center`}>
                <div className={labelStyle}> {/*中间的时间标签*/}
                    {new Date(props.Date).toLocaleDateString()}
                </div>
            </div>
            <div className={`${labelStyle} -bottom-9 -left-3`}> {/*下端点的标签*/}
                {parseFloat(props.Min.toFixed(1)) + '°'}
            </div>
        </div>
        {(props.Max > props.Min) && circle} {/*下端点*/}
    </div>
}

