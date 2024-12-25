import React from "react";
import {useDropzone} from "react-dropzone";

const FileDropZone: React.FC<{ onDropEvent: (files: File[]) => void }> = (props) => {


    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: props.onDropEvent});


    return (<div {...getRootProps()}>
        <input {...getInputProps()} />
        {
            isDragActive ?
                <p>Drop the files here ...</p> :
                <p>Drag 'n' drop some files here, or click to select files</p>
        }
    </div>);
}

export default FileDropZone;
