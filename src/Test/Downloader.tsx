import {getUrl} from "../urlPicker";
import {LabeledSelect} from "../common/Inputs";
import {useEffect, useState} from "react";


const baseUrl = getUrl();

export const Downloader = (props:{trigger:boolean}) => {

    const [fileID, setFileID] = useState(''); // 保存文件ID的数组
    const url = baseUrl + '/upload/getFileIDs';
    const [fileIDs, setFileIDs] = useState<string []>([]); // 保存文件ID的数组

    useEffect(() => {
        fetch(url,{
            method: 'GET',
            // headers: {
            //     'Content-Type': 'application/json',
            // },
            // 告诉服务器，我们发送的数据类型是json
            // body: JSON.stringify({
            //     name: 'John',
            //     age: 30
            // }),
            // 发送的数据，必须是字符串，这里是json字符串: `{"name":"John","age":30}`
        }).then(response => response.json())
            .then(data => {
                setFileIDs(data);
                setFileID(data[0]);
            })
            .catch(error => {
                console.log('请求出错', error);
            });
    },[props.trigger]);




    const handleDownload=async ()=> {
        try {
            if (!fileID) return;
            const downloadUrl = baseUrl + '/upload/download/' + fileID;
            // window.open(url);
            //开始下载数据，一段一段的下载，类似chunk 或者stream
            const response: Response = await fetch(downloadUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }


            const reader = response.body!.getReader();
            const contentLength = +response.headers.get('Content-Length')!;
            const fileName = response.headers.get('Content-Disposition')!.match(/filename="(.+)"/)![1];
            console.log(fileName);

            let receivedLength = 0;
            const chunks = [];
            // let i=0;

            while(true) {
                const {done, value} = await reader.read();
                // if (i===0) console.log(value); // 每次从后端收到的数据不一定是1024*1024字节，有以下几个原因：
// 网络传输的特性:虽然后端每次发送固定大小的块,但在网络传输过程中,这些块可能会被进一步分割成更小的数据包。这取决于网络条件、TCP拥塞控制机制等因素。因此,前端接收到的块大小可能与后端发送的块大小不完全一致。
// 浏览器的实现:不同的浏览器对于处理数据块的方式可能有所不同。有些浏览器可能会将接收到的数据包合并成更大的块,而有些浏览器可能会将数据包直接传递给应用层。这导致前端通过reader.read()接收到的块大小可能与后端发送的块大小不同。
// 文件大小和最后一个块:当文件大小不是块大小的整数倍时,最后一个块的大小可能会小于指定的块大小。例如,如果文件大小为5.5MB,而块大小为1MB,那么最后一个块的大小将为0.5MB。

                if (done) {
                    break;
                }

                chunks.push(value);
                // console.log(value.length);
                receivedLength += value.length;
                // i++;

                console.log(`Received ${receivedLength} of ${contentLength}`);
            }
            // console.log(chunks.length, chunks[0]);

            const blob = new Blob(chunks);
            // 这里的Blob 也可以用 const blob = await response.blob();一次性获得

            const url = window.URL.createObjectURL(blob);
            // console.log(url); //例如 blob:http://localhost:5173/117287b0-a12f-4a38-b6b6-56e4d0ab3570，117287b0-a12f-4a38-b6b6-56e4d0ab3570是浏览器生成的唯一标识符
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName || 'download';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);


            // window.open(url);

        } catch(error) {
            console.error('Download failed:', error);
        }

    };

    console.log(fileID);







    return <div className={`flex gap-3 flex-col items-center`}>
        <LabeledSelect label={`Choose file`}
                       placeholder={``}
                       onValueSet={setFileID}
                       value={fileID}
                       values={fileIDs.map(item=>({value:item, text:item}))}
        />
        <button onClick={handleDownload} className={`btn-primary w-28 flex justify-center`}>Download</button>
    </div>
}