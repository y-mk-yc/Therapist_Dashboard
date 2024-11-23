import React, { useState } from 'react';
import axios, {AxiosProgressEvent, AxiosResponse} from 'axios';
import SparkMD5 from 'spark-md5';
import {getUrl} from '../urlPicker';
import {v4 as uuidv4} from 'uuid';

const baseUrl = getUrl();

export const FileUploader = (props: {
    accept?: string | undefined,
    trigger:boolean,
    setTrigger:React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [uploadDisabled, setUploadDisabled] = useState(false);

    let bytesUploaded = 0;
    const fileID = `FileID-${uuidv4()}`;
    let uploadFileresponse: AxiosResponse<any, any>,MD5Verificationresponse;


    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length>0) {
            setFile(e.target.files[0]);
        // Only one file, so we take the first element
        //e.target.files is a FileList object, which is a list of File objects
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploadDisabled(true);
        setMessage('Uploading...');

        const chunkSize = 1024 * 1024; // 1MB=1024*1024B，也就是每次上传1MB
        const totalChunks = Math.ceil(file.size / chunkSize); // Math.ceil() 方法返回大于或等于一个给定数字的最小整数,即向上取整
        //获得文件的MB数
        const md5 = new SparkMD5.ArrayBuffer();

        for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize; //第0块的起始位置是0，第1块的起始位置是1MB
            const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
            //如果最后一块的结束位置超过文件大小，就取文件大小，否则取结束位置
            const chunk = file.slice(start, end);  //获得文件的某一块，单位为字节

            md5.append(await chunk.arrayBuffer());//arrayBuffer() 方法返回一个包含数组缓冲区的Promise对象,可以理解成字节数组

            const formData = new FormData();
            formData.append('chunk', chunk);
            formData.append('chunkIndex', i.toString());
            formData.append('totalChunks', totalChunks.toString());
            formData.append('fileName', file.name);
            formData.append('fileID',fileID);

            uploadFileresponse = await axios.post('/', formData, {
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    bytesUploaded = start + progressEvent.loaded;
                    const percentCompleted = Math.round(
                        ( bytesUploaded * 100 ) / file.size
                    );
                    setProgress(percentCompleted);
                },
                baseURL: baseUrl+`/upload`
            });
        }
        const fileMD5 = md5.end(); //获得文件的MD5值
        console.log(fileMD5);
        MD5Verificationresponse = await axios.post('/complete', { fileID:fileID, fileName: file.name, md5: fileMD5 },{
            baseURL: baseUrl+`/upload`
            // params:{
            //     test: 'test'
            // }
            // req.query.test ,后端查询参数
        });

        //上述代码也可以写成axios({method:'post',url:'/complete',data:{fileID:fileID, fileName: file.name, md5: fileMD5},baseURL:baseUrl+`/upload`})
        if(uploadFileresponse.data ==='Upload file successful' && MD5Verificationresponse.data === 'MD5 match'){
            setMessage('Upload successful');
        }
        // setFile(null);//完成上传后清空代表这个文件的metadata
        setProgress(0);//完成上传后清空进度条
        setUploadDisabled(false);
        props.setTrigger(!props.trigger);
    };

    return (
        <div className={`flex flex-col gap-4`}>
            <div className={`flex justify-between gap-4`}>
            <input type="file" onChange={handleFileChange} multiple={false} accept={props.accept} disabled={uploadDisabled}/>
            {/*multiple 默认是undefined，即false*/}
            <button onClick={handleUpload} className={`btn-primary`} disabled={uploadDisabled}>Upload</button>
            </div>
            <div className={`flex justify-between gap-4 items-center`}>
                <div> Progress:</div>
            <progress value={progress} max={100} className={`w-full animate-pulse`} />
            </div>
            <div>{message}</div>
        </div>
    );
};