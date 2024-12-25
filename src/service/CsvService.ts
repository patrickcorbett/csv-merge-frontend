import CsvFile from "../models/CsvFile.ts";
import * as FileSaver from "file-saver";

export async function getCsvFiles(): Promise<CsvFile[]> {
    const response = await fetch('http://localhost:8080/api/v1/files');
    const resData = await response.json();
    if (!response.ok) {
        throw new Error('Failed to upload file.');
    }
    return resData;
}

export async function uploadFiles(files: File[]) {
    for (const file of files) {
        // upload the file
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch('http://localhost:8080/api/v1/multipart', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload file.');
        }
    }
}

export async function mergeFiles(files: CsvFile[]) {

    const response = await fetch('http://localhost:8080/api/v1/merge', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({files})
    });

    if (!response.ok) {
        throw new Error('Failed to upload file.');
    }

    const data = await response.blob();

    FileSaver.saveAs(
        new Blob([data], {type: 'file.csv'}),
        'file.csv',
    )
}

