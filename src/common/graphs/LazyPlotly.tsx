import React, {FC, lazy, Suspense, useEffect, useState} from "react";
import {Loader} from "../Loader";
import {PlotParams} from "react-plotly.js";

//这里是一个懒加载的组件，实际是react-plotly.js文件的export default class Plot extends React.Component<PlotParams> {}组件
const ImportedPlot =
    lazy(() => import('react-plotly.js'))

export const LazyPlot: FC<PlotParams> = (props) => {
    //懒加载的Plot组件,props传递给react-plotly.js文件的Plot组件
    return <Suspense fallback={<Loader />}>
        <ImportedPlot {...props}/>
    </Suspense>
}