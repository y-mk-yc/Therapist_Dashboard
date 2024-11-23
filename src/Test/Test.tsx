import {FileUploader} from "./FileUploader";
import {Downloader} from "./Downloader";
import {useState} from "react";

export const Test = () => {
    const [trigger, setTrigger] = useState(false)
    return <div className={`flex flex-col gap-10 p-10`}>
        <div className={`card w-[400px] flex flex-col items-center gap-4`}>
            <p>GLB file upload test</p>
            <FileUploader accept={`.glb`} trigger = {trigger} setTrigger={setTrigger}/>
        </div>
        <div className={`card w-[400px] flex flex-col items-center gap-4`}>
            <p>GLB file download test</p>
            <Downloader trigger = {trigger}/>
        </div>
    </div>
}